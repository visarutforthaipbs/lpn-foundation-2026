#!/usr/bin/env python3
"""Import the reviewed columns of the reviewer spreadsheet back into the drafts (stdlib only).

    python3 scripts/import_translations.py [docs/translations/lpn-website-translations.csv] [--dry-run]

For every row whose "<Language> reviewed" cell is filled:
  - notes start with "message: <id>"  -> messages/<locale>.json at <id>
  - otherwise                          -> src/i18n/drafts/<locale>.json[key (English)]
and the key is recorded in src/i18n/drafts/_reviewed.json, so the next export shows it as reviewed.
Placeholders like {count} must survive review; rows that drop or add one are rejected.
After import: commit the JSON files; flip the locale in src/i18n/review.ts only when every
HELP-CRITICAL row (and ideally every row) of that language is reviewed.
"""
import csv
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DRAFTS = os.path.join(ROOT, 'src', 'i18n', 'drafts')
MESSAGES = os.path.join(ROOT, 'messages')
DEFAULT = os.path.join(ROOT, 'docs', 'translations', 'lpn-website-translations.csv')
LOCALES = [('my', 'Burmese'), ('km', 'Khmer'), ('lo', 'Lao')]


def load(path, default):
    try:
        with open(path, encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        return default


def save(path, data):
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=1 if path.startswith(DRAFTS) else 2)
        f.write('\n')


def set_path(obj, path, value):
    parts = path.split('.')
    for part in parts[:-1]:
        obj = obj.setdefault(part, {})
    obj[parts[-1]] = value


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    dry = '--dry-run' in sys.argv
    path = args[0] if args else DEFAULT
    drafts = {loc: load(os.path.join(DRAFTS, f'{loc}.json'), {}) for loc, _ in LOCALES}
    msgs = {loc: load(os.path.join(MESSAGES, f'{loc}.json'), {}) for loc, _ in LOCALES}
    reviewed = load(os.path.join(DRAFTS, '_reviewed.json'), {})
    counts = {loc: 0 for loc, _ in LOCALES}
    rejected = []

    with open(path, encoding='utf-8-sig', newline='') as f:
        for n, row in enumerate(csv.DictReader(f), start=2):
            key = row['key (English)']
            note = row.get('notes', '').split(';')[0].strip()
            for loc, name in LOCALES:
                value = (row.get(f'{name} reviewed') or '').strip()
                if not value:
                    continue
                if set(re.findall(r'\{\w+\}', key)) != set(re.findall(r'\{\w+\}', value)):
                    rejected.append(f'line {n} {name}: placeholders differ from the English key')
                    continue
                lead = key[: len(key) - len(key.lstrip())]
                trail = key[len(key.rstrip()):]
                if note.startswith('message:'):
                    set_path(msgs[loc], note.split(':', 1)[1].strip(), value)
                    marker = note
                else:
                    drafts[loc][key] = lead + value + trail
                    marker = key
                done = reviewed.setdefault(loc, [])
                if marker not in done:
                    done.append(marker)
                counts[loc] += 1

    for r in rejected:
        print('REJECTED', r)
    print('reviewed rows imported:', ', '.join(f'{loc}={c}' for loc, c in counts.items()), '(dry run)' if dry else '')
    if dry:
        return
    for loc, _ in LOCALES:
        save(os.path.join(DRAFTS, f'{loc}.json'), drafts[loc])
        save(os.path.join(MESSAGES, f'{loc}.json'), msgs[loc])
    save(os.path.join(DRAFTS, '_reviewed.json'), reviewed)


if __name__ == '__main__':
    main()
