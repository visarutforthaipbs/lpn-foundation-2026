#!/usr/bin/env python3
"""Export every Burmese/Khmer/Lao UI string to ONE reviewer spreadsheet (stdlib only).

    python3 scripts/export_translations.py            # writes docs/translations/lpn-website-translations.csv

Rows:
  - every key of src/i18n/drafts/{my,km,lo}.json (key = the exact English string used by tx())
  - every next-intl message in messages/en.json (notes column carries "message: <id>")
Columns: key (English), Thai, Burmese draft, Burmese reviewed, Khmer draft, Khmer reviewed,
         Lao draft, Lao reviewed, page(s), notes
"Thai" comes from the th-branch of the same tx() call (static extraction via
scripts/i18n_extract_strings.cjs -> src/i18n/drafts/_sources.json, needs node + typescript;
skipped with a warning if node is unavailable). "reviewed" columns are pre-filled for strings
already imported by scripts/import_translations.py (src/i18n/drafts/_reviewed.json) and kept
from an existing CSV, so re-exporting never wipes a reviewer's work.
"""
import csv
import json
import os
import re
import shutil
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DRAFTS = os.path.join(ROOT, 'src', 'i18n', 'drafts')
MESSAGES = os.path.join(ROOT, 'messages')
OUT = os.path.join(ROOT, 'docs', 'translations', 'lpn-website-translations.csv')
LOCALES = [('my', 'Burmese'), ('km', 'Khmer'), ('lo', 'Lao')]
HEADER = ['key (English)', 'Thai'] + [c for _, n in LOCALES for c in (f'{n} draft', f'{n} reviewed')] + ['page(s)', 'notes']

ALL_PAGES = 'all pages (header/footer)'
FILE_PAGES = [
    (r'\[locale\]/layout\.tsx$', ALL_PAGES),
    (r'components/(SiteHeader|SiteFooter|MobileMenu|LocaleSwitcher)\.tsx$', ALL_PAGES),
    (r'\[locale\]/page\.tsx$', '/'),
    (r'\[locale\]/post/\[slug\]/page\.tsx$', '/post/<slug>'),
    (r'\[locale\]/stories/\[slug\]/page\.tsx$', '/stories/<slug>'),
    (r'\[locale\]/([a-z-]+)/page\.tsx$', None),  # -> /<folder>
    (r'components/DonationChannelPreview\.tsx$', '/donate'),
    (r'components/ReportLibrary\.tsx$', '/impact'),
    (r'components/(PartnerTimeline)\.tsx$', '/projects'),
    (r'components/HelpIntakeForm\.tsx$', '/get-help'),
    (r'content/projects\.ts$', '/projects'),
    (r'content/partnerProjects\.ts$', '/projects'),
    (r'content/services\.ts$', '/services'),
    (r'content/about\.ts$', '/about'),
]
HELP_CRITICAL = {'/get-help', ALL_PAGES}
# Runtime-only strings (data passed through tx() rather than literals in a tx() call).
RUNTIME_SOURCES = [
    ('src/lib/content.ts', ALL_PAGES + '; /get-help; /contact'),
    ('src/seed/wix-pages.snapshot.json', '/projects'),
    ('src/lib/hero-images.ts', '/'),
]


def load(path, default):
    try:
        with open(path, encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        return default


def page_for(file):
    for pattern, page in FILE_PAGES:
        m = re.search(pattern, file)
        if m:
            return page if page is not None else '/' + m.group(1)
    return file


def run_extractor():
    node = shutil.which('node') or '/usr/local/bin/node'
    out = os.path.join(DRAFTS, '_sources.json')
    files = []
    for base in ('src/app/(frontend)', 'src/components', 'src/content'):
        for dirpath, _, names in os.walk(os.path.join(ROOT, base)):
            files += [os.path.relpath(os.path.join(dirpath, n), ROOT) for n in names if n.endswith(('.ts', '.tsx'))]
    try:
        r = subprocess.run([node, 'scripts/i18n_extract_strings.cjs', out, *sorted(files)], cwd=ROOT,
                           capture_output=True, text=True, check=True)
        print(r.stdout.strip())
    except (OSError, subprocess.CalledProcessError) as e:
        print(f'warning: static extraction skipped ({e}); using existing _sources.json', file=sys.stderr)
    return load(out, {})


def runtime_page(key, cache={}):
    """Find which data file a runtime-only English string comes from (best effort)."""
    for rel, page in RUNTIME_SOURCES:
        if rel not in cache:
            try:
                cache[rel] = open(os.path.join(ROOT, rel), encoding='utf-8').read()
            except FileNotFoundError:
                cache[rel] = ''
        text = cache[rel]
        if key in text or key.replace("'", '’') in text or key.replace("'", "\\'") in text:
            return page
    return 'runtime data'


def flatten(obj, prefix=''):
    for k, v in obj.items():
        path = f'{prefix}.{k}' if prefix else k
        if isinstance(v, dict):
            yield from flatten(v, path)
        else:
            yield path, v


def get_path(obj, path):
    for part in path.split('.'):
        if not isinstance(obj, dict) or part not in obj:
            return ''
        obj = obj[part]
    return obj if isinstance(obj, str) else ''


def main():
    sources = run_extractor()
    drafts = {loc: load(os.path.join(DRAFTS, f'{loc}.json'), {}) for loc, _ in LOCALES}
    reviewed = load(os.path.join(DRAFTS, '_reviewed.json'), {})
    msgs = {loc: load(os.path.join(MESSAGES, f'{loc}.json'), {}) for loc in ['en', 'th'] + [l for l, _ in LOCALES]}

    previous = {}
    if os.path.exists(OUT):
        with open(OUT, encoding='utf-8-sig', newline='') as f:
            for row in csv.DictReader(f):
                previous[(row['key (English)'], row['notes'].split(';')[0])] = row

    rows = []
    keys = list(dict.fromkeys(k for loc, _ in LOCALES for k in drafts[loc]))
    for key in keys:
        src = sources.get(key, {})
        files = src.get('files', [])
        pages = sorted({page_for(f) for f in files}) or [runtime_page(key)]
        notes = []
        if all(drafts[l].get(key) == key for l, _ in LOCALES):
            notes.append('name/address — keep as is')
        if re.search(r'\{\w+\}', key):
            notes.append('keep {placeholders} exactly')
        if HELP_CRITICAL & set(pages):
            notes.append('HELP-CRITICAL')
        row = {'key (English)': key, 'Thai': src.get('th', ''), 'page(s)': '; '.join(pages), 'notes': '; '.join(notes)}
        for loc, name in LOCALES:
            row[f'{name} draft'] = drafts[loc].get(key, '')
            row[f'{name} reviewed'] = drafts[loc].get(key, '') if key in reviewed.get(loc, []) else ''
        rows.append(row)

    for mid, en_text in flatten(msgs['en']):
        note = f'message: {mid}'
        row = {'key (English)': en_text, 'Thai': get_path(msgs['th'], mid), 'page(s)': '/get-help' if mid.startswith(('helpForm', 'quickExit')) else ALL_PAGES,
               'notes': note + ('; HELP-CRITICAL' if mid.startswith(('helpForm', 'quickExit')) else '') + ('; keep {placeholders} exactly' if '{' in en_text else '')}
        for loc, name in LOCALES:
            row[f'{name} draft'] = get_path(msgs[loc], mid)
            row[f'{name} reviewed'] = get_path(msgs[loc], mid) if note in reviewed.get(loc, []) else ''
        rows.append(row)

    # keep reviewer input from an existing CSV
    for row in rows:
        old = previous.get((row['key (English)'], row['notes'].split(';')[0]))
        if old:
            for _, name in LOCALES:
                if old.get(f'{name} reviewed') and not row[f'{name} reviewed']:
                    row[f'{name} reviewed'] = old[f'{name} reviewed']

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, 'w', encoding='utf-8-sig', newline='') as f:  # BOM: Excel/Sheets open UTF-8 correctly
        w = csv.DictWriter(f, fieldnames=HEADER, quoting=csv.QUOTE_ALL)
        w.writeheader()
        w.writerows(rows)
    n_msg = sum(1 for r in rows if r['notes'].startswith('message:'))
    print(f'wrote {os.path.relpath(OUT, ROOT)}: {len(rows)} rows ({len(rows) - n_msg} tx strings + {n_msg} messages); '
          f'with Thai: {sum(1 for r in rows if r["Thai"])}; help-critical: {sum(1 for r in rows if "HELP-CRITICAL" in r["notes"])}')


if __name__ == '__main__':
    main()
