#!/usr/bin/env python3
"""Crawl every frontend route in every locale against a running dev server.

Prints a status table; in dev, tx() appends every untranslated English string it renders
to src/i18n/drafts/_missing.txt, so a crawl of the draft locales fills that file.

usage: python3 scripts/i18n_crawl.py [--base http://localhost:3000] [--locales my,km,lo]
stdlib only.
"""
import argparse
import json
import subprocess
import time
import urllib.error
import urllib.parse
import urllib.request

ROUTES = ['', '/about', '/our-work', '/impact', '/get-help', '/donate', '/contact', '/team',
          '/blog', '/blog?page=2', '/projects', '/services', '/stories', '/ghost-fleet',
          '/__post__', '/__story__', '/this-page-does-not-exist']


def sample_slugs():
    """One Thai post, one English post, one story — from the local dev DB (psql)."""
    def q(sql):
        out = subprocess.run(['psql', 'lpn_website_dev', '-At', '-c', sql], capture_output=True, text=True).stdout
        return [line for line in out.splitlines() if line]
    th = q("select slug from posts where _status='published' and language='th' order by published_at desc nulls last limit 1")
    en = q("select slug from posts where _status='published' and language='en' order by published_at desc nulls last limit 1")
    st = q("select slug from stories where _status='published' limit 1")
    return th[:1] + en[:1], st[:1]


def fetch(url):
    t = time.time()
    try:
        with urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': 'lpn-i18n-crawl'}), timeout=300) as r:
            body = r.read().decode('utf-8', 'replace')
            return r.status, body, time.time() - t
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode('utf-8', 'replace'), time.time() - t


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--base', default='http://localhost:3000')
    ap.add_argument('--locales', default='en,th,my,km,lo')
    ap.add_argument('--json', help='write results to this file')
    a = ap.parse_args()
    posts, stories = sample_slugs()
    routes = []
    for r in ROUTES:
        if r == '/__post__':
            routes += [f'/post/{urllib.parse.quote(s)}' for s in posts]
        elif r == '/__story__':
            routes += [f'/stories/{urllib.parse.quote(s)}' for s in stories]
        else:
            routes.append(r)
    locales = a.locales.split(',')
    results = {}
    for loc in locales:
        for r in routes:
            code, body, dt = fetch(f'{a.base}/{loc}{r}')
            lang = ''
            i = body.find('<html')
            if i >= 0:
                j = body.find('lang="', i)
                lang = body[j + 6: body.find('"', j + 6)] if j >= 0 else ''
            results[f'/{loc}{r}'] = {'status': code, 'lang': lang, 'secs': round(dt, 1),
                                     'noindex': 'noindex' in body}
            print(f'{code}  lang={lang:<3} noindex={str(results[f"/{loc}{r}"]["noindex"]):<5} {dt:5.1f}s  /{loc}{urllib.parse.unquote(r)[:60]}', flush=True)
    if a.json:
        json.dump(results, open(a.json, 'w'), ensure_ascii=False, indent=1)


if __name__ == '__main__':
    main()
