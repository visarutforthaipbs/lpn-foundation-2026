# Wix-to-Payload content migration — 30 September 2026

The new site is deployed at https://lpn-foundation-2026.vercel.app. The public
`lpnfoundation.org` domain still points to Wix; DNS cutover is a separate step.

## Content moved

| Content | Wix source | Payload destination | Result |
| --- | ---: | ---: | --- |
| Published blog posts | 83 | 83 | All present; one newly imported in this pass |
| Unpublished blog drafts | 6 | 6 | Imported with `_status: draft`; not public |
| Editorial pages | 9 in each language | 9 | Complete English and Thai Wix text archived in each CMS page; substantive details integrated into redesigned pages |
| Empty events page | 1 | 0 | No editorial copy to migrate; existing redirect remains |
| Referenced page images | 73 distinct across both languages | 73 matched | All present in Payload; 3 Thai-home assets were already present from other imports |
| Media library entries | — | 262 | Every public image URL returned an image in a GET check |

All 83 published Wix blog slugs are recorded in `src/seed/wix-blog-urls.json`.
The post route permanently redirects old slugs to the corresponding migrated
article, preserving shared Wix article links after DNS cutover.

The Wix page text and media references are preserved in
`src/seed/wix-pages.snapshot.json` and `src/seed/wix-pages.th.snapshot.json`.
Re-export with `python3 src/seed/export-wix-pages.py --locale=en` and
`python3 src/seed/export-wix-pages.py --locale=th` while Wix remains live.
The `Wix source archive` and `Wix source archive (th)` blocks hold the complete
source text and are hidden from visitors. Locale-specific `Wix integrated copy`
blocks add selected historical detail to the redesigned pages. The Thai archive
was added to both local development and production Payload databases on
30 September 2026.

## Page-by-page coverage

| Wix page | New location | Treatment |
| --- | --- | --- |
| Home | `/th`, `/en` | Hero, impact, three pillars, trafficking cycle, causes, action cards, emergency contacts, and the latest three Payload articles |
| About | `/about` | Mission, exploitation mechanisms, theory of change, work streams, and approach combined in one bilingual page |
| Team | `/team` | Leaders, awards, staff, and migrant youth network, with longer source biographies |
| Services | `/services` | Rescue, advocacy, education, and programme deep dives combined in one bilingual page |
| Projects | `/projects` | Six issue areas, seven dated funder collaborations in a year filter, and the two extended worker networks |
| Ghost Fleet | `/ghost-fleet` | Film summary and attributed review in each language; old screening dates retained only in the source archive |
| News | `/news` plus `/blog` | Historical press and publications on News; 83 migrated articles in the blog |
| Contact | `/contact` and site footer | Urgent help, four language hotlines, office location, and email |
| Donate | `/donate` | Donation purpose, bank transfer details, and partnership contact |
| Events | — | Wix page has no editorial copy; historical events remain in articles or source archive where applicable |

Repeated donation and hotline calls to action were merged into the relevant
pages and persistent footer. Original Wix bank details are visible on the new
donation page; LPN should confirm the account is still active before public
domain cutover. Historical partner dates are labelled as past work so they do
not imply active grants.

The Burmese hotline is `0963812069` in the new site code, footer and contact
page CMS content. The captured Thai Wix source still contains the earlier
number, which is retained only in hidden archival copy and is replaced in
integrated content.

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
python3 src/seed/export-wix-pages.py --locale=th
pnpm exec tsx src/seed/migrate-page-media.ts --dry-run
pnpm exec tsx src/seed/migrate-page-media.ts
pnpm exec tsx src/seed/migrate-page-copy.ts --dry-run
pnpm exec tsx src/seed/migrate-page-copy.ts
pnpm exec tsx src/seed/migrate-page-copy.ts --locale=th
pnpm exec tsx src/seed/update-burmese-phone.ts
```

The blog snapshot contains unpublished drafts and is kept in the ignored
`.migration` directory on the migration machine. A future direct Wix API run
can use `WIX_API_KEY` and `WIX_SITE_ID` instead of `--snapshot` when those
credentials are valid.

## Local development copy

The development machine's ignored `.env` points to a **separate local Postgres
database** named `lpn_payload_dev_20260930`. It contains a snapshot of the
production Payload database (89 posts including drafts, 9 pages, 262 media
records). The previous local `lpn` database remains untouched. Backup dumps
are in the ignored `.migration` directory.

All 262 production media files were downloaded into the ignored local `media/`
directory, so blog images work without production Blob credentials. Leave
`BLOB_READ_WRITE_TOKEN` unset locally so development uploads cannot write to
production Blob storage. If a developer copies the database without downloading
the files, `DEV_MEDIA_ORIGIN=https://lpn-foundation-2026.vercel.app` can
temporarily proxy public media reads instead. This content copy is a snapshot;
future production edits do not automatically appear in localhost until it is
refreshed.
