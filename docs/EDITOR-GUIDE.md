# Editor Guide — LPN Foundation site

A short how-to for managing content. No coding required.

## Logging in
Go to **`/admin`** (e.g. `https://www.lpnfoundation.org/admin`) and sign in.
Seeded dev login: `admin@lpnfoundation.org` / `changeme123!` — **change this password** under your user.

## Switching language (Thai / English)
Every content field that can differ by language has a **locale selector at the top
of the edit screen** (English / ไทย). Edit one language, switch, edit the other, then
**Save**. If you leave Thai blank, the site shows the English text as a fallback —
so nothing is ever empty.

## Writing a blog post
1. **Blog → Posts → Create New**.
2. Fill **Title**, **Excerpt**, **Content** (rich text). Set the **Slug** (the URL) in
   the sidebar — for Thai-only titles, type a Latin slug yourself.
3. Pick an **Author** and **Category** (What's New / Press / Publications).
4. Upload a **Cover Image**, set **Published At**.
5. Set status to **Published** (top of the sidebar) and **Save**.
   - Save as **Draft** to keep it hidden until ready.
6. The blog index and the post page update within seconds — no deploy needed.

## Editing a page
**Content → Pages**. Pages are built from **blocks** — add/remove/reorder blocks in
the **Layout** field:
- **Hero** — big banner with heading + button
- **Stats** — number callouts (e.g. "71%")
- **Rich Text** — formatted text
- **Image + Text** — image beside text
- **Call to Action** — coloured band with a button
- **Team Grid** — shows everyone from Team Members
- **Contact Info** / **Donation Details** — for the contact & donate pages

The page URL is its **slug** (`about` → `/about`). The home page has slug `home`.

## Team members
**Content → Team Members**. Add name, role, photo, and an **order** number (lower =
shown first). They appear automatically on the Team page's Team Grid block.

## Site-wide settings
**Site → Header** (nav menu, logo, donate button) and **Site → Footer** (address,
hotline numbers, social links, bank/donation details). Changes apply to every page.

## Images
Uploaded under **Media**. Always fill the **Alt text** (localized) — it matters for
accessibility and SEO.

## SEO
Each post/page has an **SEO** section (meta title, description, social image). Leave
blank to fall back to the title/excerpt automatically.
