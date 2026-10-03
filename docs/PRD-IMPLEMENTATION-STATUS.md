# PRD implementation status — 1 October 2026

The existing Next.js/Payload site now has the PRD's two primary journeys. The homepage, header, and footer lead workers to direct contact and the separate LPN Rights Guide, while supporters can explore work, dated evidence, and giving. Thai and English pages exist for Get Help, Our Work, Impact & Reports, Stories, and Support. Historic Wix pages and migrated blog URLs remain accessible.

## Built and verified

- Get Help puts direct contact before self-help. Its displayed phone numbers read from the Payload Footer global with the migration's canonical list as fallback. The Burmese number is `0963812069`. No unverified 24/7 promise remains in the main contact journey.
- Our Work describes response, community learning, and systems change. Right Guide stays a separate PWA linked from Home, Get Help, Our Work, and the footer.
- Impact & Reports separates 2024 programme results from 2026 fisher-health research. The 2024 figures have period, unit, definition, and a source PDF. Payload has draft-aware Report and Impact Metric collections; reviewed reports can be filtered by year, topic, type, and document language.
- Stories has a consent, date, safety, and editorial sign-off gate, plus separate cover-image approval; the public route renders only published records with approved consent. No new individual story was published.
- Support describes individual and institutional paths without invented gift-to-outcome costs. Bank details render only if account fields, named reviewer, and verification date are complete in Payload. They are withheld at present.
- Payload has an additive migration for the three collections and review fields. The separate local database and Vercel preview database have the schema. A 2024 annual report and four metrics were seeded as **drafts** in both, pending LPN review. Primary navigation is editable in Payload in both locales.
- TypeScript, lint, local and production-mode builds passed. All 14 core route/locale combinations returned 200 locally. All 83 migrated published article URLs returned 200 locally and in the Vercel preview. In the preview, all 83 old Wix article paths returned the expected 200 or 308. The Thai mobile menu was opened and checked at a 390px viewport.

## Before public-domain cutover

- LPN must confirm help numbers, actual language coverage, response expectations, and the Right Guide's contact mapping. Review all 12 guide topics and translations for legal accuracy, source dates, privacy/RFID analytics, offline claims, and back links to direct help.
- LPN must verify current bank/provider details and sign off on donor and partnership terms. Until then, donor contact works but direct transfer details are withheld.
- LPN must review consent, attribution, and safe reuse of public Wix photographs, plus any new stories or identifiable images. The editorial gate blocks new story publication without recorded approval.
- Approve and publish the drafted metrics/report; supply current 2025–26 evidence. Do not combine case counts, people reached, and research sample sizes into a single total.
- Complete representative worker and donor usability tests, migrant-language review, keyboard/screen-reader checks, and broader mobile and performance QA. The article URL crawl passed; verify legacy Wix page routes and other external backlinks before DNS cutover.
- Confirm privacy consent and retention before enabling cross-site intent analytics. DNS cutover and any standalone Right Guide domain changes remain separate release steps.

The preview is for review. See [PRD-2026.md](./PRD-2026.md) for acceptance criteria and [MIGRATION-STATUS.md](./MIGRATION-STATUS.md) for the source inventory.

For an existing Payload database, run `pnpm payload migrate` before a production build. The first no-op migration records the pre-PRD schema; it is **not** a fresh-database bootstrap. `pnpm exec tsx src/seed/seed-prd-navigation.ts` sets the bilingual header, and `pnpm exec tsx src/seed/seed-prd-drafts.ts` creates the review drafts idempotently. Use the intended database environment for each command.
