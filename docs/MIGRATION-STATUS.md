# Wix-to-Payload content migration — 30 September 2026

The new site is deployed at https://lpn-foundation-2026.vercel.app. The public
`lpnfoundation.org` domain still points to Wix; DNS cutover is a separate step.

## Content moved

| Content | Wix source | Payload destination | Result |
| --- | ---: | ---: | --- |
| Published blog posts | 83 | 83 | All present; one newly imported in this pass |
| Unpublished blog drafts | 6 | 6 | Imported with `_status: draft`; not public |
| Editorial pages | 9 | 9 | Complete Wix text archived in each CMS page; selected details integrated into redesigned English pages |
| Empty events page | 1 | 0 | No editorial copy to migrate; existing redirect remains |
| Referenced page images | 70 distinct | 70 matched | 63 newly imported; 7 were already present |
| Media library entries | — | 262 | Every public image URL returned an image in a GET check |

All 83 published Wix blog slugs are recorded in `src/seed/wix-blog-urls.json`.
The post route permanently redirects old slugs to the corresponding migrated
article, preserving shared Wix article links after DNS cutover.

The Wix page text and media references are preserved in
`src/seed/wix-pages.snapshot.json`. Re-export with
`python3 src/seed/export-wix-pages.py` while the Wix site remains live. The
`Wix source archive` block on each Payload page holds the complete text and is
hidden from visitors. `Wix integrated copy` blocks add relevant detail to the
redesigned English pages. Old screening dates, outdated contact details and
bank-transfer instructions remain in the archive for editorial review; they
are not presented as current public guidance.

The Burmese hotline is `0963812069` in the new site code, footer and contact
page CMS content. The Wix Home and Contact edits were published on 30 September
2026; both public pages now display the new number.

Wix native CMS collections `Items` (three placeholder entries),
`contentsubmission` (three legacy submissions), `contact13` (empty), and
`multiStepSales` (one private form submission) were not republished as site
content. Wix app/system collections remain in Wix and are not part of the
new site's editorial model.

## Repeatable commands

The migration scripts require Payload's `DATABASE_URL`, `PAYLOAD_SECRET` and
`BLOB_READ_WRITE_TOKEN` in the environment. Keep credentials out of Git.

```bash
pnpm migrate:blog --snapshot=.migration/wix-blog-missing.json --dry-run
pnpm migrate:blog --snapshot=.migration/wix-blog-missing.json
python3 src/seed/export-wix-pages.py
pnpm exec tsx src/seed/migrate-page-media.ts --dry-run
pnpm exec tsx src/seed/migrate-page-media.ts
pnpm exec tsx src/seed/migrate-page-copy.ts --dry-run
pnpm exec tsx src/seed/migrate-page-copy.ts
pnpm exec tsx src/seed/update-burmese-phone.ts
```

The blog snapshot contains unpublished drafts and is kept in the ignored
`.migration` directory on the migration machine. A future direct Wix API run
can use `WIX_API_KEY` and `WIX_SITE_ID` instead of `--snapshot` when those
credentials are valid.
