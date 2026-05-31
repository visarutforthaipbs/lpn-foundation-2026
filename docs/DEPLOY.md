# Deployment & DNS cutover

Stack: one Next.js + Payload app on **Vercel Pro**, **Neon Postgres**, **Vercel Blob**.

## 1. Provision the database (Neon)
1. Create a Neon project (region close to your users, e.g. Singapore for Thailand).
2. Copy the **pooled** connection string — the host ends in `-pooler` and includes
   `?sslmode=require`. Using the unpooled string will exhaust connections on serverless.

## 2. Provision media storage (Vercel Blob)
1. In the Vercel project → **Storage → Create → Blob**.
2. Vercel injects `BLOB_READ_WRITE_TOKEN` into the project automatically.

## 3. Create the Vercel project
1. Push this repo to GitHub and **Import** it in Vercel (or `vercel` CLI).
2. Framework preset: **Next.js** (auto-detected). Build command and output are default.
3. Set **Environment Variables** (Production):
   | Key | Value |
   |---|---|
   | `PAYLOAD_SECRET` | a long random string (`openssl rand -hex 32`) |
   | `DATABASE_URL` | Neon **pooled** connection string |
   | `BLOB_READ_WRITE_TOKEN` | (auto-set by the Blob store) |
   | `NEXT_PUBLIC_SERVER_URL` | `https://www.lpnfoundation.org` |
4. Deploy. On first boot Payload pushes the schema to the empty Neon DB.

> For stricter production schema control, switch from dev push to **migrations**:
> `pnpm payload migrate:create`, commit the file, and Payload runs it on deploy.

## 4. Seed & migrate content (once, against production)
Point your local `.env` `DATABASE_URL`/`BLOB_READ_WRITE_TOKEN` at the production
values (or run from a one-off environment), then:
```bash
pnpm seed            # admin user, categories, globals, core pages
pnpm migrate:blog    # imports the 19 posts from the live Wix site
```
Then log in at `/admin`, change the admin password, and review/translate content.
(Imported post bodies are best-effort — a few image/link-heavy posts need a cleanup pass.)

## 5. DNS cutover (the only step Claude can't do for you)
This switches the live domain from Wix to Vercel. Do it after QA on a Vercel preview URL.
1. In **Vercel → Project → Domains**, add `lpnfoundation.org` and `www.lpnfoundation.org`.
   Vercel shows the exact records to set.
2. At your **domain registrar / DNS provider** (where the domain's nameservers point):
   - `www` → CNAME → `cname.vercel-dns.com`
   - apex `lpnfoundation.org` → A record `76.76.21.21` (or Vercel's shown value), or use
     an ALIAS/ANAME to `cname.vercel-dns.com`.
   - Remove the old Wix records.
3. DNS propagation takes minutes to a few hours. Vercel auto-provisions HTTPS.
4. **Then cancel the Wix subscription** once the Vercel site is confirmed live.

### URL continuity
- `/post/{slug}`, `/about`, etc. carry over unchanged (the i18n middleware adds the
  `/en` or `/th` prefix). `/services-1` and `/events-page` 301-redirect to the new slugs
  (see `next.config.ts`).
- Submit the new `sitemap.xml` in Google Search Console after cutover.
