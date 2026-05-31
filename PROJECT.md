# PROJECT.md — LPN Foundation headless rebuild (agent handoff)

> Read this first. It's the orientation doc for anyone (human or a fresh agent
> session) picking up this project. The detailed technical spec lives in
> [`docs/PLAN.md`](docs/PLAN.md) — this file explains the *why*, the *current
> state*, the *conventions*, and the *gotchas* so you can safely build on top.

## What we are doing

Rebuilding the website of the **Labour Rights Promotion Network (LPN) Foundation**
— a Thai anti-human-trafficking / migrant-worker-rights NGO (current live site:
`https://www.lpnfoundation.org`, bilingual Thai/English) — moving it **off Wix**
onto a **self-owned headless stack**.

### Why (the motivation that drives every decision)
1. **Stop the recurring Wix subscription.**
2. **Own the content and data** (no platform lock-in).
3. **First-class Thai/English bilingual** content — Wix's headless i18n was the
   weak point that made staying on Wix unattractive.

The user is **the sole content editor** and is technical enough to run a dev
server. Keep the editing experience simple; don't over-engineer for a big team.

## The stack (LOCKED — do not re-litigate)

| Layer | Choice | Notes |
|---|---|---|
| Frontend + CMS | **Next.js 16 (App Router) + Payload 3**, one unified repo | Payload runs *inside* Next at `/admin` + `/api` |
| Hosting | **Vercel Pro** (already paid for) | one deploy serves site + admin + API |
| Database | **Neon Postgres** (prod) / local Homebrew Postgres (dev) | use the **pooled** Neon string in prod |
| Media | **Vercel Blob** (`@payloadcms/storage-vercel-blob`) | falls back to local disk when no token |
| i18n routing | **next-intl** (`/en`, `/th`) | mirrors current Wix URL scheme |
| i18n content | **Payload field localization** | `localized: true` fields |

Pinned versions: Payload **3.85.0**, Next **16.2.6**, React **19.2.6**, next-intl **4.13.0**.

## Current state (verified, as of 2026-05-31)

**Milestones 0–5 are DONE and verified.** `pnpm build` passes type-check and prerenders
**100 static pages**. Confirmed by build + curl + DB:
- Bilingual routing `/en` `/th`, `/admin`, sitemap.xml, robots.txt all serve correctly.
- Content model: `pages` (blocks builder), `posts`, `authors`, `categories`, `teamMembers`,
  `media`; globals `header`/`footer`. All localized, public read, drafts on posts/pages.
- **All 82 published blog posts migrated from Wix (19 EN + 63 TH)** via the **Wix Blog REST
  API** (`src/seed/migrate-blog.ts`), Ricos rich content → Lexical, images → Payload media.
  Per-language: `/en/blog` lists the 19 EN, `/th/blog` the 63 TH (filtered by `language` field).
  Thai-script slugs preserved → live Wix URLs carry over.
- Baseline content seeded (`src/seed/seed.ts`): admin user, categories, globals (real bank
  + hotline details), core pages, team members — bilingual.
- SEO: localized metadata + hreflang, dynamic sitemap, robots, 301 redirects, on-publish
  revalidation hooks (guarded so CLI scripts don't call revalidatePath).

**Credentials:** `WIX_API_KEY` + `WIX_SITE_ID` (site `15156e07-…`) are in `.env` (gitignored)
for re-running the migration. The Wix API returns only *published* posts — ~6 drafts the
owner mentioned are not included; pull via the Blog *draft* API if needed.

**What's left (owner actions, see `docs/DEPLOY.md`):** provision Neon + Vercel Blob, set prod
env, deploy, run `pnpm seed` + `pnpm migrate:blog` against prod, then DNS cutover from Wix.
Also: translate Thai where pages fall back to English; review a few image/link-heavy posts.

## Repo layout (what exists now)

```
lpn-foundation/
├── PROJECT.md                       ← this file
├── docs/PLAN.md                     ← full spec: content model, migration, milestones
├── package.json                     ← stable pins; Postgres+Blob+next-intl added
├── pnpm-workspace.yaml              ← native-build allowlist (pnpm 11 `allowBuilds:`)
├── next.config.ts                   ← withPayload(withNextIntl(...)) composed
├── .env                             ← real (PAYLOAD_SECRET generated, local DB url)
├── .env.example                     ← template for prod (Neon + Blob)
└── src/
    ├── payload.config.ts            ← Postgres adapter + en/th localization + Blob plugin
    ├── proxy.ts                     ← next-intl middleware (Next 16 renamed middleware→proxy)
    ├── i18n/
    │   ├── routing.ts               ← locales ['en','th'], defaultLocale 'en', prefix 'always'
    │   ├── request.ts               ← loads messages/{locale}.json
    │   └── navigation.ts            ← locale-aware Link/redirect/usePathname
    ├── collections/{Users,Media}.ts ← Media.alt is localized
    ├── app/(frontend)/[locale]/     ← bilingual home + root layout (html lang, IntlProvider)
    ├── app/(frontend)/styles.css
    └── app/(payload)/...            ← Payload admin & api routes (untouched template)
└── messages/{en,th}.json            ← UI chrome strings (nav, home, CTAs)
```

## Conventions (follow these when extending)

- **Localized content** → mark Payload fields `localized: true`. **UI chrome**
  (button labels, nav text) → add keys to BOTH `messages/en.json` and `messages/th.json`.
- **Links in the frontend** → import `Link` from `@/i18n/navigation`, NOT `next/link`,
  so the locale prefix is carried automatically.
- **Server components** read translations via `getTranslations()` and must call
  `setRequestLocale(locale)` for static rendering.
- **Default locale is `en`** in two places: `src/i18n/routing.ts` AND
  `src/payload.config.ts`. To make **Thai primary**, change both.
- **Never** let next-intl's `proxy.ts` matcher catch `/admin` or `/api` (Payload owns those).
- After changing Payload schema, run `pnpm generate:types` to refresh `src/payload-types.ts`.

## Gotchas already discovered (don't re-hit these)

- **`create-payload-app` requires a TTY** and fails in a non-interactive shell.
  This project was scaffolded by `degit`-ing the `payloadcms/payload/templates/blank`
  template, then fixing it (it came from monorepo HEAD with `workspace:*` deps,
  Mongo, and Node>=24). Don't re-run create-payload-app here.
- **corepack pnpm is broken** on this machine (signature key error). pnpm was
  installed via `npm i -g pnpm` after removing the corepack shims. pnpm is 11.5.0.
- **pnpm 11 moved the native-build allowlist** out of `package.json` into
  `pnpm-workspace.yaml` as `allowBuilds:` (all set to `true` here for sharp/esbuild/etc).
- **Next 16 renamed `middleware.ts` → `proxy.ts`** (the old name warns). We use `proxy.ts`.
- **No Docker on this machine.** Local dev uses Homebrew `postgresql@14` with trust
  auth; DB `lpn`, connection `postgres://<mac-user>@127.0.0.1:5432/lpn`.
- **`code` CLI is not on PATH.** VS Code is installed; open via the app-bundle binary
  `/Applications/Visual Studio Code.app/Contents/Resources/app/bin/code` or `open -a`.
- **NEVER `TRUNCATE media CASCADE` in Postgres.** Many tables FK to `media` (page `meta.image`,
  block image fields, team `photo`, globals `logo`), so a media CASCADE wipes pages, team,
  and globals too. To reset, delete via the Payload API or truncate only leaf tables
  (`TRUNCATE posts RESTART IDENTITY CASCADE` is safe — posts is a child of media, not a parent).
- **Thai slugs need `\p{M}` in the slug regex.** Thai vowel/tone marks are Unicode *Marks*,
  not Letters — `formatSlug` must allow `\p{L}\p{N}\p{M}` or Thai slugs get mangled (404s).
- **Dynamic route params arrive percent-encoded for non-ASCII.** Post/page routes call
  `decodeURIComponent(params.slug)` before querying, or Thai-slug posts 404 (ASCII EN posts
  appear to work, masking the bug). See `post/[slug]/page.tsx`.
- **Wix Blog API needs an API key + `wix-site-id` header** (not the Secrets Manager). The
  list endpoint returns only *published* posts. Account-level key works across the owner's sites.
- **Localized content inside blocks/arrays aligns by row `id`.** When seeding a page in two
  locales on one document, save EN, then copy the saved block/array `id`s onto the TH payload
  (recursively — covers nested arrays like stats `items`) before the TH update. Otherwise the
  second locale regenerates the rows and **wipes the first locale's content**. See
  `seedBilingualPage` + `copyIds` in `src/seed/seed.ts`.

## How to run it

```bash
brew services start postgresql@14   # if not running
createdb lpn                        # first time only
pnpm install
pnpm dev                            # http://localhost:3000  → /admin, /en, /th
```
Then open `http://localhost:3000/admin` to create the admin user.

## Where to go next (continuation point)

Per `docs/PLAN.md`, **Milestone 1 — content model**:
1. Add collections: `posts`, `authors`, `categories`, `teamMembers`, `pages` (blocks builder).
2. Add globals: `header`, `footer`.
3. Localize the right fields; wire access control for a single admin.
4. `pnpm generate:types`, register collections in `src/payload.config.ts`.

Then Milestone 2 (frontend rendering of blog + pages), 3 (migrate the 19 Wix blog
posts + ~10 pages), 4 (SEO/redirects/revalidation), 5 (QA + DNS cutover).

Not yet done: `git init` (no repo initialized yet), no admin user created, no
production Neon/Blob provisioned.
