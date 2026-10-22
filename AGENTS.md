# AGENTS.md — LPN Foundation website (operating manual)

> Part of the LPN product family — module map: `~/Documents/ChatGPT/LPN/README.md` (website = M1; intake/Right Guide/brand are siblings).

> Read this first, every session. It is the source of truth for how the site is
> built, shipped, and kept healthy. `PROJECT.md` (May 2026) and `current.md` are
> historical handoffs — trust this file where they disagree. When you change how
> the site works, update this file in the same commit.

## 1. What this is

The new website of the **Labour Rights Promotion Network (LPN) Foundation** —
Thai anti-trafficking / migrant-worker-rights NGO — replacing the Wix site at
`https://www.lpnfoundation.org`. Bilingual Thai/English. The owner (Visarut) is
the sole editor and the developer's client; LPN staff review content.

| Thing | Where |
|---|---|
| Repo | `/Users/visarutsankham/Documents/ChatGPT/LPN/website` |
| GitHub | `visarutforthaipbs/lpn-foundation-2026` — `main` = production |
| Vercel project | `lpn-foundation-2026` (team `visarutforthaipbs-projects`, id `prj_24MUqLWExDawMuLv5icZSeAtlDOQ`) |
| Live Vercel URL | `https://lpn-foundation-2026.vercel.app` (`/th`, `/en`, `/admin`) |
| Public domain | `https://www.lpnfoundation.org` — **still on Wix** (DNS cutover not done; see §7) |
| Database | Neon Postgres `ep-divine-term-ap7h6e9y` / `neondb` (us-east-1) — **one DB for everything, see §5** |
| Media | Vercel Blob (`@payloadcms/storage-vercel-blob`, `addRandomSuffix: true`) |
| Local dev | `pnpm dev` → `http://localhost:3000` (often already running from a previous session — check `lsof -iTCP:3000`) |

## 2. Stack (locked — do not re-litigate)

Next.js 16 (App Router) + Payload 3 in one repo (admin at `/admin`, API at
`/api`), React 19, Tailwind v4, next-intl 4 (`/en`, `/th`, default locale `en`
in BOTH `src/i18n/routing.ts` and `src/payload.config.ts`), lucide icons.
Fonts: IBM Plex Sans (Latin) + DB Helvethaica X (Thai). pnpm 12, Node 20+
(use `/usr/local/bin/node`; nvm also has 22/24).

## 3. File map

```
src/
  app/(frontend)/[locale]/        one folder per route: page.tsx, about, blog, post/[slug],
                                  get-help, our-work, impact, stories(/[slug]), donate(/preview),
                                  contact, projects, services, team, [slug] (CMS pages)
  app/(frontend)/styles.css       THE design system: @theme tokens, type scale, .btn/.card/
                                  .glass-*/.tactile-* components, legacy-utility remap, dark mode
  app/(payload)/                  Payload admin + API routes (template — rarely touched)
  app/sitemap.ts, robots.ts       dynamic sitemap (~111 URLs), robots
  collections/                    Users Media Pages Posts Authors Categories TeamMembers
                                  ImpactMetrics Reports Stories   (all localized en/th)
  globals/Header.ts, Footer.ts    nav + hotlines + socials (editable in /admin)
  blocks/index.ts                 page-builder blocks; rendered by components/RenderBlocks.tsx
  components/                     SiteHeader, SiteFooter, MobileMenu, LocaleSwitcher, ui.tsx
                                  (Section/Container/ButtonLink/StatBand/CtaBand/Eyebrow),
                                  MediaImage, RichText, ReportLibrary, PartnerTimeline, …
  lib/api.ts                      ALL Payload reads (getPosts/getPage/…): field-level `select`,
                                  per-locale `language` filter on posts
  lib/content.ts                  hard-coded fallbacks: HOTLINES, OFFICE, SOCIALS, FACEBOOK_URL
  content/*.ts                    static copy for about/services/projects (not in CMS)
  migrations/                     Payload migrations (5, 2026-09-30 → 10-01) — prod uses these
  seed/                           one-off scripts: seed.ts, migrate-blog.ts (Wix), repair-media.ts,
                                  seed-prd-*.ts, clean-blog-posts.ts; loadenv.ts loads .env+.env.local
  i18n/                           routing.ts, request.ts, navigation.ts (use ITS Link, not next/link)
  proxy.ts                        next-intl middleware (Next 16 name) — must not catch /admin or /api
messages/{en,th}.json             UI chrome strings
docs/                             DEPLOY.md, DESIGN-GUARDRAILS.md, design-audit.md (HIG audit 2026-10-18),
                                  EDITOR-GUIDE.md, PRD-2026.md, PRD-IMPLEMENTATION-STATUS.md,
                                  MIGRATION-STATUS.md, US-GIVING-SETUP.md, POSITIONING-STRATEGY.md
scripts/health_check.py           read-only weekly check (stdlib). Exit 1 on FAIL.
```

## 4. Commands

```bash
pnpm install                       # after pulling package.json changes
pnpm dev                           # dev server :3000, WEBPACK (uses .env.local → Neon, see §5)
pnpm exec tsc --noEmit             # type-check  (must pass before any commit)
pnpm lint                          # eslint      (0 errors; ~19 warnings in seed/ are known)
pnpm build                         # full prerender (~100 static pages), needs DB access
pnpm generate:types                # after ANY collection/global/field change → src/payload-types.ts
pnpm payload migrate:create        # after schema change → commit the file in src/migrations/
pnpm payload migrate:status        # which migrations the DB has
pnpm audit:posts                   # blog content sanity (--check)
/usr/bin/python3 scripts/health_check.py [--quick] [--json]
# HIG design matrix (11 routes × 390/1280 × light/dark) against the dev server:
/usr/local/bin/python3 ~/.hermes/shared-skills/creative/apple-hig-design/scripts/hig_audit_matrix.py \
  http://localhost:3000 <outdir> --wait 4000 --routes '{"home":"/th","blog":"/th/blog",...}'
```

Run project commands with `env -u PYTHONPATH -u VIRTUAL_ENV` when launched from
a Hermes shell (the Hermes venv poisons tsx/node-gyp otherwise).

## 5. Environments & the database trap

- `.env` (gitignored): `PAYLOAD_SECRET`, `DATABASE_URL` = local `127.0.0.1/lpn`
  (that local DB **does not exist** on the running postgresql@16), Wix keys.
- `.env.local` (gitignored, from `vercel env pull`): `DATABASE_URL`,
  `DATABASE_URL_UNPOOLED`, `BLOB_READ_WRITE_TOKEN` → **Neon production**.
  Next.js loads `.env.local` over `.env`, so **`pnpm dev` and `/admin` on
  localhost read and write the production database and production Blob store.**
- Vercel has the same Neon DB in production, preview AND development envs.
  There is no staging database. Treat every write — seed scripts, `/admin`
  edits, `payload migrate`, `migrate:blog` — as a production write.
- Seed scripts use `src/seed/loadenv.ts`; `tsx` scripts do NOT auto-load
  `.env.local` unless they import it — that mismatch caused the 2026 media 404s.
- Vercel prod env also carries `WIX_API_KEY`/`WIX_SITE_ID` (migration only) and
  the full Neon `POSTGRES_*`/`PG*` set from the integration.

## 6. Ship / verify / roll back

1. Branch → change → `tsc` + `lint` pass → for visual changes run the HIG matrix
   and compare before/after → commit as `Visarut Sankham <visarutsankham@gmail.com>`
   (the only author Vercel's git integration has seen; keep it).
2. Push `main` → Vercel builds (~2–3 min). Verify with
   `vercel ls --prod | head -1` → `vercel inspect <url>` shows `● Ready`, then
   curl the changed route on `lpn-foundation-2026.vercel.app`. "Deployed"
   means both of those, not "pushed".
3. Schema changes: migration file committed → Payload runs it on deploy (prod
   uses migrations, never dev push). Confirm with `pnpm payload migrate:status`.
4. Roll back: `vercel rollback <previous-url>` (instant) or revert the commit on
   `main`. Never force-push `main`. DB migrations have no automatic down path —
   write the reverse migration.
5. Never `git push` from a branch to `main` without the checks above; never
   delete branches with unmerged work.

## 7. Open items (keep true)

- **DNS cutover to Vercel not done** — `www.lpnfoundation.org` still serves Wix
  (Cloudflare). Pre-cutover gate list: `docs/PRD-IMPLEMENTATION-STATUS.md` §
  "Before public-domain cutover" (hotline confirmation, bank details, story
  consent, usability tests). Cutover steps: `docs/DEPLOY.md` §5. Owner action.
- **Font licence risk** — the site ships DB Helvethaica X (`public/fonts/`), but LPN holds
  no licence (owner, One CI review). Replace with IBM Plex Sans Thai (SIL OFL) per the
  consolidated CI in `~/Documents/ChatGPT/LPN/brand/` (BRAND.md, tokens/, assets/fonts/).
  Same work: yellow `#ffd43b` → `#FFC314`, icons → Phosphor. Goes through the HIG matrix.
- **HIG design revamp** (`docs/design-audit.md`, branch `design/hig-revamp`):
  before 56 %; after-matrix measured 0 small-text / 2 target / 2 contrast fails
  with two last fixes unverified. Branch may still be uncommitted on disk —
  check `git status` before assuming.
- 13 of 64 Thai posts have no cover image → grey box in the blog grid.
- Donate page bank details are withheld in Payload until LPN verifies them.
- `PROJECT.md` / `current.md` are stale handoffs; this file supersedes them.

## 8. Traps (learned the hard way)

- `TRUNCATE media CASCADE` wipes pages, team, globals (FK web). Never.
- **`pnpm dev` is pinned to `next dev --webpack`.** Next 16.2.6 Turbopack runs
  Tailwind's PostCSS in an unbounded pool of `node .next/dev/build/postcss.js`
  child processes: one cold `/th/blog` compile added ~870 processes, hit the
  macOS per-user cap (2666, `spawn EAGAIN`) and froze/rebooted the 16 GB Mac
  four times on 2026-10-22 (vercel/next.js#95108). With webpack the process
  table stays flat (+10) and `/th/blog` is 200 in ~36 s cold. The Turbopack
  `experimental.turbopackPluginRuntimeStrategy: 'workerThreads'` alternative
  segfaults (EXC_BAD_ACCESS in next-swc napi, Node 21 and 22). Don't remove
  `--webpack` until a Next release fixes the pool; `next build` is unaffected.
- Payload dev schema push: `pnpm dev` logs "Pulling schema from database" —
  the postgres adapter's dev `push` diffs against **production Neon**. Never
  run `pnpm dev` with an unmigrated schema change in the working tree.
- Thai slugs: `formatSlug` must allow `\p{L}\p{N}\p{M}`; route params arrive
  percent-encoded → `decodeURIComponent(params.slug)` or Thai posts 404.
- Localized blocks/arrays align by row `id`: copy saved EN ids onto the TH
  payload before the second-locale update or the first locale is wiped
  (`seedBilingualPage` + `copyIds` in `src/seed/seed.ts`).
- `getPosts` must keep its field-level `select` (no Lexical `content` in list
  queries) — removing it made `/th/blog` 10–20× slower.
- Turbopack dev sometimes misses an in-place file edit; append a newline to
  the file (or `touch` won't do) to wake the watcher.
- `.card`/`.glass-*`/`.tactile-*` class NAMES are load-bearing across ~50 call
  sites; restyle them in `styles.css`, don't rename.
- Design rules that gate every UI change: `docs/DESIGN-GUARDRAILS.md` (brand +
  Signal 39) and `docs/design-audit.md` (HIG). Yellow `#ffd43b` is the one
  accent: primary action, selection, focus. Never yellow text on white.
  Type floor 13 px, controls ≥ 44 px, no hover motion, glass only in the
  sticky header. The Thai font draws ~20 % smaller than system fonts.
- `create-payload-app` needs a TTY; corepack pnpm is broken here (use the
  global pnpm). pnpm's native-build allowlist lives in `pnpm-workspace.yaml`.
- Hermes browser tool fails when Chrome holds the real profile; use the
  Playwright snippet pattern in `scripts/` / the HIG scripts for screenshots.
