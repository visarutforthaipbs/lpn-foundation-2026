#!/usr/bin/env python3
"""Clean the text formatting of blog posts (Lexical rich text) imported from Wix.

What it fixes
  1. Structure (deterministic): empty paragraphs/headings (the big blank gaps), runs of line breaks inside a
     paragraph, leading/trailing breaks and spaces, runs of spaces / NBSP, adjacent text nodes with identical
     formatting are merged.
  2. Text format (local LLM via Ollama, default Typhoon 2.5): spacing and quotation marks only, e.g.
     ` '“ชีวิตของผม…” ` → `“ชีวิตของผม…”`. Only blocks with plain single-format text and a detectable issue are sent.
     GUARD: a model answer is accepted only if, after deleting all whitespace and quote characters, it is
     identical to the original. So the model can never change, add or remove a word, letter or digit.

Nothing is written to any database. Output:
  --report  JSON with every change (before/after per block)
  --sql     replay file: UPDATE posts_locales (+ the latest _posts_v_locales row when it holds the same content),
            each guarded by md5(old content) so it only applies to rows that still hold exactly what was read.

Usage
  /usr/bin/python3 scripts/clean_post_format.py --db postgresql://localhost:5432/lpn_website_dev \
      --report out/report.json --sql out/replay.sql [--ids 23,70] [--no-llm]
Then apply the SQL with: psql "$DB" -X -v ON_ERROR_STOP=1 -1 -f out/replay.sql
"""
import argparse
import copy
import hashlib
import json
import os
import re
import subprocess
import sys
import time
import urllib.request

QUOTES = "\"'“”‘’„«»"
STRIP_RE = re.compile(r"[\s" + re.escape(QUOTES) + r"\u00a0\u200b]")
SUSPECT_RE = re.compile(
    r"[" + re.escape(QUOTES) + r"]\s*[" + re.escape(QUOTES) + r"]"  # stacked quotes '“ or ""
    r"|\s[,.!?;:)\]]"  # space before closing punctuation
    r"|[(\[]\s"  # space after opening bracket
    r"|[a-z][,.;:!?][A-Za-z]"  # missing space after punctuation (English)
    r"|[“‘]\s|\s[”’]"  # space inside curly quotes
)
SYSTEM = (
    "You fix ONLY spacing and quotation marks in Thai or English text taken from a website article. "
    "Rules: do not change, add, remove or reorder any word, letter, digit or punctuation mark other than quotation marks. "
    "Remove doubled or mismatched quotation marks so each quotation has one opening and one closing mark (use “ ” for Thai and English). "
    "Remove spaces before , . ! ? ; : ) and inside quotation marks or brackets. In English add one space after , . ; : ! ? when missing. "
    "Keep Thai spaces between phrases as they are. Reply with the corrected text only, no explanation."
)


def psql_rows(db, sql):
    env = {k: v for k, v in os.environ.items() if not k.startswith("PG")}
    out = subprocess.run(["psql", db, "-X", "-A", "-t", "-c", sql], capture_output=True, text=True, env=env, check=True)
    return [json.loads(l) for l in out.stdout.splitlines() if l.strip()]


def is_text(n):
    return n.get("type") == "text"


def text_of(n):
    if is_text(n):
        return n.get("text", "")
    if n.get("type") == "linebreak":
        return "\n"
    return "".join(text_of(c) for c in n.get("children", []))


def blank(n):
    """Block with no visible content (only whitespace text / line breaks)."""
    kids = n.get("children", [])
    return all((is_text(c) and not c.get("text", "").strip(" \t\n\u00a0\u200b")) or c.get("type") == "linebreak" for c in kids)


def clean_inline(children):
    out = []
    for c in children:
        c = copy.deepcopy(c)
        if is_text(c):
            c["text"] = re.sub(r"[ \u00a0]{2,}", " ", c["text"].replace("\u200b", ""))
            if not c["text"]:
                continue
            p = out[-1] if out else None
            if p and is_text(p) and all(p.get(k) == c.get(k) for k in ("format", "style", "mode", "detail")):
                p["text"] = re.sub(r"[ \u00a0]{2,}", " ", p["text"] + c["text"])
                continue
        if c.get("type") == "linebreak" and out and out[-1].get("type") == "linebreak":
            continue  # collapse runs of line breaks
        if c.get("children"):
            c["children"] = clean_inline(c["children"])
        out.append(c)
    # trim edges: leading/trailing breaks and spaces
    while out and (out[0].get("type") == "linebreak" or (is_text(out[0]) and not out[0]["text"].strip())):
        out.pop(0)
    while out and (out[-1].get("type") == "linebreak" or (is_text(out[-1]) and not out[-1]["text"].strip())):
        out.pop()
    if out and is_text(out[0]):
        out[0]["text"] = out[0]["text"].lstrip(" \u00a0")
    if out and is_text(out[-1]):
        out[-1]["text"] = out[-1]["text"].rstrip(" \u00a0")
    return out


LLM_CACHE = {}


def llm_fix(text, model, url):
    if text in LLM_CACHE:
        return LLM_CACHE[text]
    body = json.dumps({
        "model": model, "stream": False, "think": False,
        "options": {"temperature": 0, "num_ctx": 8192},
        "messages": [{"role": "system", "content": SYSTEM}, {"role": "user", "content": text}],
    }).encode()
    req = urllib.request.Request(url + "/api/chat", data=body, headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=300) as r:
        out = json.load(r)["message"]["content"]
    out = re.sub(r"<think>.*?</think>", "", out, flags=re.S).strip()
    return out


THAI_SKELETON_RE = re.compile(r"[^\u0E00-\u0E7F\s]")


def same_letters(a, b):
    """GUARD for model output. Accept only if:
    - every letter/digit/punctuation (all non-space, non-quote chars) is identical and in order;
    - no quotation mark was added (count may only stay equal or drop);
    - no double spaces, no leading/trailing space;
    - spacing between Thai words is unchanged (Thai uses spaces as phrase breaks; the model must not add/remove them).
    """
    if STRIP_RE.sub("", a) != STRIP_RE.sub("", b):
        return False
    if sum(b.count(q) for q in QUOTES) > sum(a.count(q) for q in QUOTES):
        return False
    if "  " in b or b != b.strip():
        return False
    sk = lambda t: re.sub(r"\s+", " ", THAI_SKELETON_RE.sub("", t)).strip()
    return sk(a) == sk(b)


def clean_doc(content, use_llm, model, url, log):
    root = copy.deepcopy(content)
    kids = root["root"]["children"]
    new = []
    for n in kids:
        if n.get("type") in ("paragraph", "heading", "quote") and blank(n):
            log["removed_blank"] += 1
            continue
        if n.get("children") and n.get("type") in ("paragraph", "heading", "quote", "listitem", "list"):
            before = text_of(n)
            if n.get("type") == "list":
                for li in n["children"]:
                    li["children"] = clean_inline(li.get("children", []))
            else:
                n["children"] = clean_inline(n["children"])
            if text_of(n) != before:
                log["inline_fixed"] += 1
            only = n["children"]
            if use_llm and len(only) == 1 and is_text(only[0]) and SUSPECT_RE.search(only[0]["text"]) and len(only[0]["text"]) < 4000:
                orig = only[0]["text"]
                t0 = time.time()
                try:
                    fixed = llm_fix(orig, model, url)
                except Exception as e:  # model down → keep original
                    log["llm_errors"] += 1
                    log["changes"].append({"kind": "llm_error", "error": str(e)[:200], "before": orig[:200]})
                    fixed = orig
                log["llm_seconds"] += time.time() - t0
                log["llm_calls"] += 1
                if fixed != orig and same_letters(orig, fixed) and fixed.strip():
                    only[0]["text"] = fixed
                    log["llm_accepted"] += 1
                    log["changes"].append({"kind": "llm", "before": orig, "after": fixed})
                elif fixed != orig:
                    log["llm_rejected"] += 1
                    log["changes"].append({"kind": "llm_rejected", "before": orig, "model_said": fixed})
        new.append(n)
    # drop trailing horizontal rules / blanks are covered above; keep everything else (images, lists, embeds)
    root["root"]["children"] = new
    return root


def md5(obj_text):
    return hashlib.md5(obj_text.encode()).hexdigest()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--db", required=True)
    ap.add_argument("--report", required=True)
    ap.add_argument("--sql", required=True)
    ap.add_argument("--ids", default="")
    ap.add_argument("--no-llm", action="store_true")
    ap.add_argument("--model", default="scb10x/typhoon2.5-qwen3-30b-a3b:latest")
    ap.add_argument("--ollama", default="http://localhost:11434")
    ap.add_argument("--cache", default="", help="earlier --report: reuse its model answers instead of calling the model")
    a = ap.parse_args()
    if a.cache:
        for p in json.load(open(a.cache))["posts"]:
            for c in p["changes"]:
                if c["kind"] in ("llm", "llm_rejected"):
                    LLM_CACHE[c["before"]] = c.get("after") or c.get("model_said")

    where = "content is not null"
    if a.ids:
        where += " and _parent_id in (%s)" % ",".join(str(int(x)) for x in a.ids.split(","))
    rows = psql_rows(a.db, f"select json_build_object('row', id, 'post', _parent_id, 'locale', _locale, 'md5', md5(content::text), 'content', content) from posts_locales where {where} order by _parent_id, _locale")

    report, sql = {"model": None if a.no_llm else a.model, "posts": []}, ["-- generated by scripts/clean_post_format.py", "\\set ON_ERROR_STOP on"]
    tot = {"removed_blank": 0, "inline_fixed": 0, "llm_calls": 0, "llm_accepted": 0, "llm_rejected": 0, "llm_errors": 0, "llm_seconds": 0.0, "rows_changed": 0}
    for i, r in enumerate(rows, 1):
        log = {"removed_blank": 0, "inline_fixed": 0, "llm_calls": 0, "llm_accepted": 0, "llm_rejected": 0, "llm_errors": 0, "llm_seconds": 0.0, "changes": []}
        new = clean_doc(r["content"], not a.no_llm, a.model, a.ollama, log)
        changed = json.dumps(new, sort_keys=True) != json.dumps(r["content"], sort_keys=True)
        for k in tot:
            if k in log:
                tot[k] += log[k]
        if changed:
            tot["rows_changed"] += 1
            j = json.dumps(new, ensure_ascii=False)
            assert "$LPNJ$" not in j
            sql.append(f"UPDATE posts_locales SET content = $LPNJ${j}$LPNJ$::jsonb WHERE id = {r['row']} AND md5(content::text) = '{r['md5']}';")
            sql.append(
                f"UPDATE _posts_v_locales vl SET version_content = $LPNJ${j}$LPNJ$::jsonb FROM _posts_v v "
                f"WHERE vl._parent_id = v.id AND v.parent_id = {r['post']} AND v.latest AND vl._locale = '{r['locale']}' AND md5(vl.version_content::text) = '{r['md5']}';"
            )
        report["posts"].append({"post": r["post"], "locale": r["locale"], "changed": changed, **{k: v for k, v in log.items()}})
        print(f"[{i}/{len(rows)}] post {r['post']} {r['locale']}: blank-{log['removed_blank']} inline {log['inline_fixed']} llm {log['llm_accepted']}/{log['llm_calls']}", flush=True)
    report["totals"] = tot
    os.makedirs(os.path.dirname(os.path.abspath(a.report)), exist_ok=True)
    json.dump(report, open(a.report, "w"), ensure_ascii=False, indent=1)
    open(a.sql, "w").write("\n".join(sql) + "\n")
    print("TOTALS", json.dumps(tot))


if __name__ == "__main__":
    sys.exit(main())
