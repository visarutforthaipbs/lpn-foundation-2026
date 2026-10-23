#!/usr/bin/env python3
"""List English-looking text left on a rendered page (stdlib only).

usage: python3 scripts/i18n_english_leftovers.py http://localhost:3000/my/get-help [...]
Prints visible text runs of >= 3 Latin words (names/URLs/numbers aside) so a reviewer can
see what still falls back to English on a my/km/lo page. Exit 1 if any run is found.
"""
import html.parser
import re
import sys
import urllib.request

SKIP_TAGS = {'script', 'style', 'noscript', 'template'}
ALLOW = re.compile(r'LPN|Ghost Fleet|IOM|Messenger|Facebook|LINE ID|Rights Guide|Google|Samut Sakhon|Pathum Thani|'
                   r'Visarut Sankham|Realframe|Patima|Sompong|Samak|Tungpuchayakul|Srakaew|Thuptanee|FB|PDF|'
                   r'TH / EN / MY|\d')


class Text(html.parser.HTMLParser):
    def __init__(self):
        super().__init__()
        self.stack, self.runs, self.lang = [], [], []

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        self.stack.append(tag)
        self.lang.append(a.get('lang'))
        for k in ('aria-label', 'alt', 'placeholder', 'title'):
            if a.get(k):
                self.runs.append((f'[{k}] {a[k]}', a.get('lang') or self.cur_lang()))

    def handle_endtag(self, tag):
        while self.stack:
            t = self.stack.pop()
            self.lang.pop()
            if t == tag:
                break

    def cur_lang(self):
        for value in reversed(self.lang):
            if value:
                return value
        return None

    def handle_data(self, data):
        if any(t in SKIP_TAGS for t in self.stack):
            return
        if data.strip():
            self.runs.append((data.strip(), self.cur_lang()))


def leftovers(url):
    body = urllib.request.urlopen(url, timeout=300).read().decode('utf-8', 'replace')
    p = Text()
    p.feed(body)
    out = []
    for text, lang in p.runs:
        if lang == 'en':  # explicitly English (e.g. the bilingual draft notice, tracking code)
            continue
        cleaned = ALLOW.sub(' ', text)
        if re.search(r"(?:\b[A-Za-z][A-Za-z'’]+\b[\s,.:;!?—–-]+){2,}\b[A-Za-z][A-Za-z'’]+\b", cleaned):
            out.append(text[:160])
    return out


if __name__ == '__main__':
    bad = 0
    for u in sys.argv[1:]:
        found = leftovers(u)
        print(f'{len(found):3d}  {u}')
        for f in found:
            print('      ', f)
        bad += len(found)
    sys.exit(1 if bad else 0)
