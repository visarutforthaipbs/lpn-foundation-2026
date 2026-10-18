#!/usr/bin/env python3
"""Weekly health check for the LPN Foundation site (Next.js + Payload on Vercel + Neon).

Usage:
    /usr/bin/python3 scripts/health_check.py            # full (~2-4 min: type-check + lint + live)
    /usr/bin/python3 scripts/health_check.py --quick    # live + repo + env only (~20 s)
    /usr/bin/python3 scripts/health_check.py --json     # machine-readable

Read-only: never writes to the repo, the database, Vercel, or Blob. Exit 0 = all
PASS/WARN/INFO, 1 = any FAIL. Stdlib only. See AGENTS.md for what each check protects.
"""
import json, os, re, subprocess, sys, time, urllib.error, urllib.request
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
LIVE = "https://lpn-foundation-2026.vercel.app"
PUBLIC = "https://www.lpnfoundation.org"
PROD_DB_HOST = "ep-divine-term-ap7h6e9y"
UA = "Mozilla/5.0 (compatible; lpn-health/1.0)"
results = []  # (status, area, check, detail)


def add(status, area, check, detail: object = ""):
    results.append((status, area, check, str(detail).strip()[:300]))


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *a, **k):
        return None


def http(url, follow=True, timeout=30):
    """Return (status, headers, body). Never raises."""
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    opener = urllib.request.build_opener() if follow else urllib.request.build_opener(NoRedirect)
    try:
        with opener.open(req, timeout=timeout) as r:
            return r.status, {k.lower(): v for k, v in r.headers.items()}, r.read().decode("utf-8", "ignore")
    except urllib.error.HTTPError as e:
        return e.code, {k.lower(): v for k, v in (e.headers or {}).items()}, (e.read() or b"").decode("utf-8", "ignore")
    except Exception as e:
        return 0, {}, str(e)


def run(cmd, cwd=REPO, timeout=600):
    env = dict(os.environ)
    for k in ("PYTHONPATH", "VIRTUAL_ENV", "PYTHONHOME"):
        env.pop(k, None)
    env["PATH"] = "/usr/local/bin:/opt/homebrew/bin:" + env.get("PATH", "")
    try:
        p = subprocess.run(cmd, cwd=cwd, shell=isinstance(cmd, str), capture_output=True, text=True, timeout=timeout, env=env)
        return p.returncode, (p.stdout or "") + (p.stderr or "")
    except subprocess.TimeoutExpired:
        return 124, "timeout"
    except FileNotFoundError as e:
        return 127, str(e)


def env_file_hosts(path):
    """DATABASE_URL host from an env file, without exposing credentials."""
    try:
        txt = (REPO / path).read_text()
    except Exception:
        return None
    m = re.search(r'^DATABASE_URL="?postgres(?:ql)?://[^@]+@([^/:?"\s]+)', txt, re.M)
    return m.group(1) if m else None


# ---------------------------------------------------------------- repo & toolchain
def check_repo():
    rc, out = run(["git", "status", "--porcelain"])
    dirty = [l for l in out.splitlines() if l.strip()]
    rc, branch = run(["git", "branch", "--show-current"])
    branch = branch.strip()
    add("INFO", "repo", "branch", branch)
    if dirty:
        add("WARN", "repo", "uncommitted changes", f"{len(dirty)} paths dirty on '{branch}' — work not yet in git")
    else:
        add("PASS", "repo", "working tree clean")
    run(["git", "fetch", "-q", "origin", "main"], timeout=60)
    rc, ahead = run(["git", "rev-list", "--count", "origin/main..main"])
    rc, behind = run(["git", "rev-list", "--count", "main..origin/main"])
    if ahead.strip() not in ("", "0"):
        add("WARN", "repo", "main ahead of origin", f"{ahead.strip()} local commit(s) not pushed")
    elif behind.strip() not in ("", "0"):
        add("WARN", "repo", "main behind origin", f"{behind.strip()} commit(s) on GitHub not pulled")
    else:
        add("PASS", "repo", "main == origin/main")
    rc, out = run(["git", "log", "-1", "--format=%h %ad %s", "--date=short", "origin/main"])
    add("INFO", "repo", "origin/main", out.strip())

    rc, out = run(["node", "-v"])
    m = re.match(r"v(\d+)\.(\d+)", out.strip())
    if m and (int(m.group(1)), int(m.group(2))) >= (20, 9):
        add("PASS", "toolchain", "node", out.strip())
    else:
        add("FAIL", "toolchain", "node >= 20.9 required by Next 16", out.strip())
    rc, out = run(["pnpm", "-v"])
    add("PASS" if rc == 0 else "FAIL", "toolchain", "pnpm", out.strip())
    if not (REPO / "node_modules").exists():
        add("FAIL", "toolchain", "node_modules missing", "run pnpm install")


def check_env():
    for f in (".env", ".env.local"):
        if not (REPO / f).exists():
            add("WARN" if f == ".env.local" else "FAIL", "env", f"{f} present", "missing")
    local_host = env_file_hosts(".env.local")
    if local_host and PROD_DB_HOST in local_host:
        add("WARN", "env", "local dev uses the PRODUCTION Neon DB", f".env.local DATABASE_URL → {local_host} (AGENTS.md §5)")
    elif local_host:
        add("PASS", "env", ".env.local DATABASE_URL is not prod", local_host)
    not_ignored = [f for f in (".env", ".env.local") if run(["git", "check-ignore", "-q", f])[0] != 0]
    add("PASS" if not not_ignored else "FAIL", "env", ".env files gitignored", ", ".join(not_ignored) or ".env, .env.local")
    rc, out = run(["git", "ls-files", ".env", ".env.local"])
    if out.strip():
        add("FAIL", "env", "secret file tracked in git", out.strip())


def check_code():
    rc, out = run("pnpm exec tsc --noEmit", timeout=900)
    add("PASS" if rc == 0 else "FAIL", "code", "tsc --noEmit", "" if rc == 0 else out[-600:])
    rc, out = run("pnpm lint", timeout=900)
    errs = re.search(r"(\d+) errors?", out)
    nerr = int(errs.group(1)) if errs else (0 if rc == 0 else 1)
    warns = re.search(r"(\d+) warnings?", out)
    add("PASS" if nerr == 0 else "FAIL", "code", "eslint", f"{nerr} errors, {warns.group(1) if warns else 0} warnings")
    # Design floors encoded from docs/design-audit.md (HIG): no sub-11 px type, no hover motion.
    rc, out = run(r"grep -rnoE 'text-\[(8|9|10)px\]' src --include=*.tsx | wc -l")
    n = int(out.strip() or 0)
    add("PASS" if n == 0 else "WARN", "design", "no text under 11 px", f"{n} literal sub-11px class(es)")
    rc, out = run(r"grep -rnoE 'hover:scale-[0-9]+|hover:-translate-y' src --include=*.tsx | wc -l")
    n = int(out.strip() or 0)
    add("PASS" if n == 0 else "WARN", "design", "no hover motion on cards", f"{n} hover-motion class(es)")
    mig = sorted(p.name for p in (REPO / "src/migrations").glob("*.ts") if p.name != "index.ts")
    add("INFO", "db", "migrations in repo", f"{len(mig)}; latest {mig[-1] if mig else '-'}")


# ---------------------------------------------------------------- live site
def check_live():
    for path in ("/th", "/en", "/th/blog", "/en/blog", "/th/get-help", "/th/donate", "/admin", "/robots.txt"):
        t = time.time()
        st, h, body = http(LIVE + path)
        ms = int((time.time() - t) * 1000)
        add("PASS" if st == 200 else "FAIL", "live", f"GET {path}", f"{st} in {ms} ms")
    st, h, body = http(LIVE + "/sitemap.xml")
    locs = re.findall(r"<loc>(.*?)</loc>", body)
    if st == 200 and len(locs) >= 90:
        add("PASS", "live", "sitemap.xml", f"{len(locs)} URLs")
    else:
        add("FAIL", "live", "sitemap.xml", f"status {st}, {len(locs)} URLs (expected >= 90)")
    posts = [u for u in locs if "/post/" in u]
    sample = posts[:: max(1, len(posts) // 5)][:5]
    bad = []
    for u in sample:
        st, _, _ = http(u)
        if st != 200:
            bad.append(f"{st} {u}")
    add("PASS" if not bad else "FAIL", "live", f"sampled {len(sample)} post URLs", "; ".join(bad) or "all 200")
    st, h, body = http(LIVE + "/th")
    low = body.lower()  # React renders the attribute as hrefLang=
    add("PASS" if 'hreflang="en"' in low and 'hreflang="th"' in low else "WARN", "seo", "hreflang en+th on /th")
    add("PASS" if "<h1" in body else "FAIL", "seo", "/th has an h1")
    st, h, _ = http(LIVE + "/services-1", follow=False)
    add("PASS" if st in (301, 307, 308) else "WARN", "seo", "legacy /services-1 redirects", f"{st} → {h.get('location', '-')}")
    st, h, _ = http(LIVE + "/api/globals/footer?depth=0")
    add("PASS" if st == 200 else "FAIL", "live", "Payload API (globals/footer)", st)


def check_vercel():
    rc, out = run("vercel ls --prod 2>/dev/null | grep -oE 'https://[^ ]+' | head -1", timeout=60)
    url = out.strip()
    if not url:
        add("WARN", "vercel", "vercel CLI unavailable or not logged in", out[-200:])
        return
    rc, out = run(f"vercel inspect {url} 2>&1", timeout=60)  # vercel prints to stderr
    status = re.search(r"status\s+●?\s*(\w+)", out)
    created = re.search(r"created\s+(.+)", out)
    s = status.group(1) if status else "?"
    add("PASS" if s.lower() == "ready" else "FAIL", "vercel", "latest production deployment", f"{s} — {created.group(1).strip() if created else ''} — {url}")


def check_domain():
    st, h, _ = http(PUBLIC)
    server = h.get("server", "")
    if "vercel" in server.lower() or h.get("x-vercel-id"):
        add("PASS", "domain", "www.lpnfoundation.org on Vercel", f"{st} server={server}")
    else:
        add("INFO", "domain", "www.lpnfoundation.org NOT yet on Vercel (DNS cutover pending)", f"{st} server={server or '-'}")


def check_dev_server():
    st, _, _ = http("http://localhost:3000/th", timeout=10)
    add("INFO", "local", "dev server :3000", "up" if st == 200 else "not running")


# ---------------------------------------------------------------- main
def main():
    quick = "--quick" in sys.argv
    as_json = "--json" in sys.argv
    check_repo()
    check_env()
    if not quick:
        check_code()
    check_live()
    check_vercel()
    check_domain()
    check_dev_server()

    fails = [r for r in results if r[0] == "FAIL"]
    warns = [r for r in results if r[0] == "WARN"]
    if as_json:
        print(json.dumps({"ok": not fails, "fail": len(fails), "warn": len(warns),
                          "results": [dict(zip(("status", "area", "check", "detail"), r)) for r in results]}, ensure_ascii=False, indent=1))
    else:
        print(f"LPN site health — {time.strftime('%Y-%m-%d %H:%M')} — {'FAIL' if fails else 'OK'} "
              f"({len(fails)} fail, {len(warns)} warn, {len(results)} checks){' [quick]' if quick else ''}")
        for st, area, check, detail in results:
            print(f"  {st:4} {area:9} {check}" + (f" — {detail}" if detail else ""))
    sys.exit(1 if fails else 0)


if __name__ == "__main__":
    main()
