# Post content audit — 1 October 2026

The current Payload collection contains 89 migrated Wix posts: 83 published and
6 drafts. We audited every title, excerpt, SEO title and description, and
Lexical body text in the post's source language. The audit found emoji in five
published posts and one draft. It also found unfinished download/donation calls
to action, a literal download-link placeholder, standalone social hashtags, and
unverified bank details in three published articles.

The editorial cleanup changed 12 published post bodies and the latest version
of one draft. It removed emoji while keeping surrounding words, removed dead
download and donation prompts where no target link existed, removed social-only
tag blocks, and removed unverified bank-transfer details. No report URL or bank
account was invented. The Thai and English PDF links in the 2026 fisher-health
report post remain intact, as do all other pre-existing hyperlinks. Historical
article narrative was otherwise preserved.

The same cleanup was applied to the separate local development database and
the Neon Payload database after backups in the ignored `.migration` directory.
`pnpm audit:posts` now checks the current database for emoji, the identified
unfinished placeholders, and unverified bank-account text. The Posts collection
also strips emoji from new or edited post copy on save. For a fresh database
that still has the original imported content, preview the guarded one-time
cleanup with `pnpm exec tsx src/seed/clean-blog-posts.ts`, take a database
backup, then run it with `--apply`.

The removed PDF prompts should only return if LPN supplies verified report
files or links. Donation account details should only return after LPN verifies
the account through the review process described in the PRD. Historical phone
and email details in article text were not rewritten; LPN should confirm them
before treating them as current help contacts.
