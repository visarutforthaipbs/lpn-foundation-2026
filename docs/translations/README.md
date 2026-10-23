# Website translations — Burmese (my), Khmer (km), Lao (lo)

Status: **machine drafts, pending native-speaker review.** While `src/i18n/review.ts` has a
locale set to `false`, every page in that locale shows a draft notice (in the language + English),
carries `noindex`, and is left out of hreflang alternates and the sitemap.

## One spreadsheet

`lpn-website-translations.csv` (UTF-8 with BOM — opens correctly in Excel / Google Sheets).

| column | meaning |
|---|---|
| key (English) | the exact English text the site uses — do **not** edit |
| Thai | the Thai wording of the same string, for context (blank when there is no Thai twin) |
| Burmese/Khmer/Lao draft | current machine draft |
| Burmese/Khmer/Lao reviewed | **reviewer writes the approved text here** (leave blank = not reviewed) |
| page(s) | where the string appears (`all pages (header/footer)` = header, footer, layout) |
| notes | `HELP-CRITICAL` (get-help, hotlines, intake form, Quick Exit — review first), `keep {placeholders} exactly`, `name/address — keep as is`, `message: <id>` (next-intl message) |

Rules for reviewers: plain, short, respectful; keep names, numbers, phone numbers, URLs,
"LPN", "IOM", "Ghost Fleet" unchanged; keep `{count}`-style placeholders exactly.
Shared vocabulary (brand §10): Get help · Send a voice message · Tracking code · Check my request ·
LPN hotline · Quick exit.

## Round trip

```bash
python3 scripts/export_translations.py                  # regenerate the CSV (keeps reviewed cells)
python3 scripts/import_translations.py --dry-run        # check a returned CSV
python3 scripts/import_translations.py                  # write reviewed text into src/i18n/drafts/*.json + messages/*.json
```

Import rejects a row whose placeholders differ from the English key and records imported keys in
`src/i18n/drafts/_reviewed.json`. Publish a language (flip it to `true` in `src/i18n/review.ts`)
only after every HELP-CRITICAL row of that language is reviewed.

## Adding / changing copy

Pages call `tx(locale, thaiValue, englishValue)` (`src/i18n/tx.ts`; client components use
`useTx()` from `src/i18n/tx-client.tsx` inside a `<TxProvider dict={draftDict(locale)}>`).
A new English string without a draft falls back to English and, in `pnpm dev`, is appended to
`src/i18n/drafts/_missing.txt` (gitignored). After a copy change: crawl
(`python3 scripts/i18n_crawl.py --locales my,km,lo`), translate the lines in `_missing.txt` into
`src/i18n/drafts/{my,km,lo}.json`, re-export the CSV. `python3 scripts/i18n_english_leftovers.py <url>`
lists English text still visible on a rendered page.

CMS content (Payload pages, team members, reports, metrics, stories, header/footer globals) falls
back to English on my/km/lo until an editor fills the Burmese/Khmer/Lao locale in /admin. News posts
always stay in their original language; my/km/lo readers see every post with a language badge.
