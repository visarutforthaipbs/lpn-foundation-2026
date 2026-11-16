#!/usr/bin/env python3
"""Legacy Wix URL continuity check.

Reads the Wix sitemap URLs (cached copies or live) plus the Thai variants Wix serves
under /th/..., and asks the new site what each path returns. Prints a markdown table
and a summary line. Read-only; stdlib only.

Usage:
    /usr/bin/python3 scripts/legacy_url_check.py [--base http://localhost:3000] [--wix-dir DIR] [--json out.json]

Wix URL shapes covered (checked 2026-10-23 against the live Wix site):
  - unprefixed = English (`/about`, `/post/<slug>`); `/en/...` 301s to the unprefixed form
  - `/th/<page>` = Thai page variant (200 on Wix for every page)
  - `/th/post/<thai-slug>` = Thai posts (not in the Wix sitemap; from src/seed/wix-blog-urls.json)
  - `?lang=th` 301s to `/th` on Wix
  - `/blog/categories/<slug>` = blog category pages (English only on Wix)
"""
import json, re, sys, urllib.parse, urllib.request, urllib.error
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
WIX = "https://www.lpnfoundation.org"
UA = "Mozilla/5.0 (compatible; lpn-legacy-check/1.0)"


def arg(flag, default=None):
    if flag in sys.argv:
        return sys.argv[sys.argv.index(flag) + 1]
    return default


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *a, **k):
        return None


def head(url, timeout=90):
    req = urllib.request.Request(url, method="HEAD", headers={"User-Agent": UA})
    try:
        with urllib.request.build_opener(NoRedirect).open(req, timeout=timeout) as r:
            return r.status, r.headers.get("location", "")
    except urllib.error.HTTPError as e:
        return e.code, (e.headers or {}).get("location", "") if e.headers else ""
    except Exception as e:
        return 0, str(e)[:60]


def follow(base, path, max_hops=5):
    """Follow redirects on the new site; return (first_status, hops, final_status, final_path)."""
    hops = []
    cur = path
    first = None
    for _ in range(max_hops):
        st, loc = head(base + cur)
        if first is None:
            first = st
        if st in (301, 302, 307, 308) and loc:
            nxt = loc
            if nxt.startswith("http"):
                nxt = urllib.parse.urlsplit(nxt)
                nxt = nxt.path + (("?" + nxt.query) if nxt.query else "")
            hops.append(nxt)
            cur = nxt
            continue
        return first, hops, st, cur
    return first, hops, 0, cur


def wix_paths(wix_dir):
    paths = []
    for f in ("pages-sitemap.xml", "blog-posts-sitemap.xml", "blog-categories-sitemap.xml"):
        txt = (Path(wix_dir) / f).read_text()
        for loc in re.findall(r"<loc>(.*?)</loc>", txt):
            p = urllib.parse.urlsplit(loc).path or "/"
            paths.append((f.replace("-sitemap.xml", ""), p))
    return paths


def main():
    base = arg("--base", "http://localhost:3000").rstrip("/")
    wix_dir = arg("--wix-dir", str(REPO / "docs" / "legacy-wix-sitemaps"))
    out_json = arg("--json")
    rows = []
    seen = set()

    def add(group, path):
        if path in seen:
            return
        seen.add(path)
        rows.append((group, path))

    for group, p in wix_paths(wix_dir):
        add(group, p)
        # Wix Thai variants: every page has a /th twin; posts in the EN sitemap are EN-only.
        if group == "pages":
            add("pages (th)", "/th" + ("" if p == "/" else p))
    # Thai posts (Wix serves them at /th/post/<slug>, outside the sitemap).
    posts = json.loads((REPO / "src/seed/wix-blog-urls.json").read_text())
    for post in posts:
        if post["language"] == "th":
            add("blog-posts (th)", "/th/post/" + urllib.parse.quote(post["slug"]))
    # Language-variant shapes Wix itself redirects.
    for p in ("/en", "/en/about", "/en/blog", "/?lang=th", "/?lang=en", "/about?lang=th"):
        add("lang-variants", p)

    results = []
    bad = 0
    for group, p in rows:
        first, hops, final, final_path = follow(base, p)
        status = f"{first}" + (" → " + " → ".join(hops) if hops else "")
        ok = final == 200
        if not ok:
            bad += 1
        results.append({"group": group, "wix": WIX + p, "path": p, "first": first, "hops": hops,
                        "final": final, "final_path": final_path, "ok": ok})
        print(f"{'OK ' if ok else 'BAD'} {first:>3} {p[:70]:<70} {' → '.join(hops)[:80]} [{final}]", file=sys.stderr)

    print("| # | Wix URL | New site response | Final |")
    print("|---|---|---|---|")
    for i, r in enumerate(results, 1):
        chain = str(r["first"]) + ("".join(f" → 308 `{urllib.parse.unquote(h)}`" if False else f" → `{urllib.parse.unquote(h)}`" for h in r["hops"]))
        print(f"| {i} | `{urllib.parse.unquote(r['path'])}` | {chain} | {r['final']} |")
    print()
    print(f"TOTAL {len(results)} Wix URLs checked against {base}: {len(results) - bad} end in 200, {bad} do not")
    if out_json:
        Path(out_json).write_text(json.dumps(results, ensure_ascii=False, indent=1))
    sys.exit(1 if bad else 0)


if __name__ == "__main__":
    main()
