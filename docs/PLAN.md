# LPN Foundation — Headless Rebuild Plan

Migrating **lpnfoundation.org** off Wix to a self-owned headless stack.

## Stack (locked)

| Layer | Choice |
|---|---|
| Frontend + CMS | **Next.js 15/16 (App Router) + Payload 3**, unified in one repo |
| Hosting | **Vercel Pro** (one deploy serves site + `/admin` + API) |
| Database | **Neon Postgres** (use the *pooled* connection string in prod) |
| Media/uploads | **Vercel Blob** (`@payloadcms/storage-vercel-blob`) |
| i18n | **next-intl** (`/en`, `/th`) + Payload field localization |
| Language | TypeScript, React 19 |

### Why this stack
Leaving Wix to (a) stop the recurring subscription, (b) own the content/data, and
(c) get first-class Thai/English. Payload's localization is native and free; running
it inside Next means one codebase and on-publish revalidation with no webhook.

## Localization model
- **Payload**: `localization: { locales: ['en','th'], defaultLocale: 'en', fallback: true }`.
  Localized fields get their own `*_locales` table; untranslated Thai falls back to English.
- **Routing**: next-intl, `localePrefix: 'always'` → `/en/...`, `/th/...` (mirrors current Wix URLs).
- **UI chrome** (nav, buttons): `messages/en.json`, `messages/th.json`.
- To make **Thai** the primary locale: flip `defaultLocale` in `src/i18n/routing.ts` *and* `src/payload.config.ts`.

## Content model (Payload)

**Collections**
- `users` — admin auth (just you).
- `media` — uploads; `alt` localized; Vercel Blob in prod, local disk in dev.
- `posts` — title✱, slug, excerpt✱, content✱ (Lexical), coverImage→media, author→authors, category→categories, publishedAt, drafts/versions, SEO✱. *(19 posts to migrate)*
- `authors` — name, photo, bio✱, role✱.
- `categories` — title✱, slug. Seed: *What's New, Press, Publications*.
- `teamMembers` — name, photo, role✱, bio✱, order → renders `/team`.
- `pages` — slug + `layout` blocks builder: `Hero`, `Stats`, `RichText`, `ImageText`, `CTA`, `TeamGrid`, `ContactInfo`, `DonationDetails`. *(home, about, projects, services, ghost-fleet, contact, donate, news, events)*

**Globals**
- `header` — logo, nav items (label✱ + link), donate CTA.
- `footer` — address✱, socials, hotline numbers (Thai/Khmer/Lao/Burmese), bank/donation details✱.

✱ = localized field

## Frontend routes
```
/[locale]                    → pages(slug:"home")
/[locale]/about|team|projects|services|ghost-fleet|news|events|contact|donate
/[locale]/blog               → posts index + category filter
/[locale]/post/[slug]        → post detail   (matches current /post/… URLs)
```
Redirects (`next.config`): `/services-1→/services`, `/events-page→/events`.

## Rendering & revalidation
Static + ISR via `generateStaticParams`. Because Payload runs in the same app, an
`afterChange` hook calls `revalidatePath`/`revalidateTag` on publish — no redeploy.

## Migration
- **Blog (19 posts)** → scripted: fetch each `/post/{slug}`, parse with cheerio
  (title, date, author, body, cover), upload images → Blob, HTML→Lexical, upsert by slug.
- **Pages (~10)** → built by hand in admin (bespoke layouts).
- **Authors/categories** → seed script.

## SEO / launch
Localized metadata + `hreflang`, dynamic `sitemap.xml` + `robots.ts`, 301s, OG images.
Cutover = point DNS from Wix to Vercel after QA on both locales.

---

## Milestones & status

- [x] **0 — Scaffold** · Next + Payload (Postgres) + next-intl + Blob wired; `/admin`, `/en`, `/th` render; schema pushed. ✅ DONE
- [ ] **1 — Content model** · collections (posts/authors/categories/teamMembers/pages) + globals (header/footer) + solo-admin access control.
- [ ] **2 — Frontend** · blog index/detail, page-block renderer, header/footer, locale switcher, brand theme (Tailwind).
- [ ] **3 — Migration** · seed authors/categories; scripted blog import; hand-build pages.
- [ ] **4 — SEO** · metadata, hreflang, sitemap, robots, redirects, revalidation hooks.
- [ ] **5 — Launch** · QA both locales, perf, editor doc, DNS cutover.

---

## Local development

```bash
# Postgres (local dev uses Homebrew Postgres 14 + trust auth)
brew services start postgresql@14
createdb lpn                       # once

pnpm install
pnpm dev                           # → http://localhost:3000  (/admin, /en, /th)
pnpm generate:types                # regenerate src/payload-types.ts after schema changes
```

`.env` (local):
```
PAYLOAD_SECRET=<generated>
DATABASE_URL=postgres://<your-mac-user>@127.0.0.1:5432/lpn
BLOB_READ_WRITE_TOKEN=             # blank locally → uploads use local disk
```

First run: open http://localhost:3000/admin to create the admin user.

## Production setup (when ready to deploy)
1. **Neon**: create a project; copy the **pooled** connection string (host ends `-pooler`) → `DATABASE_URL`.
2. **Vercel Blob**: create a Blob store in the Vercel project → it injects `BLOB_READ_WRITE_TOKEN`.
3. Set `PAYLOAD_SECRET`, `DATABASE_URL`, `BLOB_READ_WRITE_TOKEN` in Vercel env vars.
4. Deploy. Payload pushes schema on first boot (use migrations for stricter control later).
