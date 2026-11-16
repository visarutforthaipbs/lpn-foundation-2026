# www.lpnfoundation.org — cutover plan (Wix → Vercel), owner-paced

Today: `www.lpnfoundation.org` = Wix (DNS ns8/ns9.wixdns.net, registrar Network Solutions). The new site is complete
at `lpn-foundation-2026.vercel.app` (One CI shipped 23 Oct; help form PR #4 pending). The Cloudflare zone
`lpnfoundation.org` exists (pending) with all 15 Wix records copied. Wix refuses a nameserver change while the domain is
"assigned" to the Wix site → **the DNS move IS the website cutover.** No half-way state exists.

## Wix billing facts (owner screenshot + RDAP, 2026-11-16)
- Wix Premium Plan "Core": US$264 + 7% VAT = US$282.48 per 2 years (invoice #1158697051, 24 Jan 2025, billed to Visarut Sankham, Visa ••••8693) ≈ 9,500 THB/2 yr ≈ 4,750 THB/yr at 33.64. 2-year billing, last paid 24 Jan 2025, **next charge 5 Jan 2027** → cut over and cancel before then, or Wix renews for 2 more years.
- Domain lpnfoundation.org: separate bill (registrar Network Solutions via Wix, card ••••8693). Renewal due 15 Oct 2026 FAILED
  ("payment problem"); registry expiry was 2026-11-14 → on 2026-11-16 www/apex resolve to Wix 199.15.163.139 and 302 to
  expiredwixdomain.com — **site down**. RDAP status "auto renew period" (grace). Owner fixes the card + renews in Wix; LPN keeps
  paying the domain whatever hosts the site.

## Phase A — finish the site (code: this week)
- [ ] merge website PR #4 (help form → intake API) — owner "merge"
- [ ] legacy Wix URL map: crawl the live Wix sitemap, add 301s for anything not already covered (DEPLOY.md §5 URL continuity)
      Checked 2026-11-06 (66 legacy paths vs preview): all pages + posts resolve EXCEPT
      `/blog/categories/{press,publications,whats-new}` (Wix 200, new 404 → 301 to /en/blog or a filter) and
      `/th/post/17-seriously-inspiring-mission-and-vision-statement-of-lpn` (Wix 200, new 404 → 301 to its EN post).
      Unprefixed legacy paths (`/ghost-fleet`, `/post/x`) currently 307 → `/en/…`: make them permanent (308/301) —
      Wix served English at the root, so Google should see a permanent move, not a temporary one.
- [ ] SEO keep-list for traffic pages (Ghost Fleet first): keep the exact URL `/th/ghost-fleet` + `/en/ghost-fleet`;
      meta description at least as rich as Wix's (names Patima, Shannon Service, Vulcan); og:image = the film still,
      not the generic share card; JSON-LD (Movie/CreativeWork + Organization); link the Ghost Fleet blog posts (ghost-fleet-th-01, ghostfleetinjapan, …) and
      /get-help /donate from the page. Baseline the top pages/queries (Wix Analytics or Search Console export) BEFORE cutover.
- [ ] Vercel production env `NEXT_PUBLIC_SERVER_URL=https://www.lpnfoundation.org` set + redeployed IN the cutover —
      canonical, hreflang, sitemap and robots all derive from it (today they say lpn-foundation-2026.vercel.app;
      leaving that = telling Google the real site is the vercel.app copy).
- [ ] hotline block = the 4 numbers Wix shows today (TH 084-121-1609, KM 085-534-1595, LO 092-321-1516, MY 034-434-726)
      — the Payload `help channels` global currently shows Burmese 0963812069; LPN to confirm which is right (NEEDS E6)
- [x] Right Guide links (home, our-work, get-help, footer) → `https://guide.lpnfoundation.org/` (2026-11-16, local)

## Subdomains guide + intake — owner decision 2026-11-16 (drop lpnrightguide.site)
`lpnrightguide.site`: Namecheap, expires **2026-12-09**, NS Cloudflare (adi/cody); it carries BOTH `www` (Right Guide,
Vercel) and `intake` (sev02 tunnel + Access). Renew it ONE last year (~US$30) so redirects + RFID cards keep working.
- guide — does NOT wait for cutover (a CNAME/A in Wix DNS is enough):
  - [x] Vercel: `guide.lpnfoundation.org` added to project `rfid-rights-lpn-2025` (CLI, 2026-11-16)
  - [x] sev02 `CORS_ORIGINS` += `https://guide.lpnfoundation.org` (backup `.env.bak-20261116-cors`; preflight 204 verified)
  - [x] owner, Wix DNS: `A  guide  76.76.21.21` → cert issued (https 200, 2026-11-16)
  - [x] Turnstile widget `lpn-intake` (CF account visarutforlpn@gmail.com) already lists `lpnfoundation.org` since 23 Oct — covers guide/www.
        Proof: widget rendered on guide → 600010 (bot check, automation) vs lpn-foundation-2026.vercel.app → 110200 (host not allowed)
  - [x] Vercel env `NEXT_PUBLIC_SITE_URL` www.lpnrightguide.site → https://guide.lpnfoundation.org; PR #4 merged (8a8ffba); prod ● Ready; canonical/robots/sitemap = guide
  - [x] Vercel: `www.lpnrightguide.site` + apex → 308 to `guide.lpnfoundation.org`, path + query kept (`?uid=` RFID links survive). Keep 12 months
  - [ ] test /voice-report + /track on a real phone on the new host (owner)
  - NOTE: website preview lpn-foundation-2026.vercel.app is NOT a Turnstile hostname → the /get-help form can't pass there; fine after cutover (www.lpnfoundation.org is covered)
- intake — needs the lpnfoundation.org zone on Cloudflare (tunnel hostnames only work on a Cloudflare zone) = Phase C:
  - [ ] pre-create in the pending zone: tunnel public hostname `intake.lpnfoundation.org` → `http://127.0.0.1:3100`;
        copy the Access app/policies from intake.lpnrightguide.site to the new host
  - [ ] cutover night: sev02 `AUTH_URL` + `PUBLIC_DASHBOARD_URL` → `https://intake.lpnfoundation.org`; recreate app+worker
        (staff log in once again); Right Guide + website `NEXT_PUBLIC_INTAKE_URL` → new host, redeploy both
  - [ ] keep `intake.lpnrightguide.site` serving the public API until 2027-12 (old cached app builds still post there)
- [ ] run `scripts/health_check.py` + HIG matrix one last time on the preview; Lighthouse mobile ≥ 90 perf on /th

## Donate page — status 2026-10-25
- Bank details CONFIRMED by Patima (Messenger, 25 Oct): เครือข่ายส่งเสริมคุณภาพชีวิตแรงงาน · Krungthai · Chamchuri Square · 162-0-09432-0 · SWIFT KRTHTHBK. Entered in the footer global (local DB; replay on prod at ship).
- WAITING (Patima, "next week"): PromptPay ID (tax ID or phone) → I generate the QR on the page; receipts + tax-deduction wording.
- Then: rebuild /donate from "design preview" to real page (QR + account + copy buttons; foreign donors: SWIFT + contact for receipt), remove the preview banner and the "decisions to review" box.

## Phase B — LPN gates (not code; from docs/PRD-IMPLEMENTATION-STATUS.md "Before public-domain cutover")
1. Help numbers + language coverage + response expectations confirmed (same list as E6)
2. Bank/provider details verified → donate page unblocked (today withheld)
3. Photo consent/attribution for reused Wix images; story consent
4. Metrics/report approved with 2025–26 evidence
5. Usability test (2 workers + 1 donor), migrant-language review, keyboard/screen-reader pass
6. Privacy consent + retention text approved
Owner collects these in one meeting with LPN; each is a checkbox in PRD-IMPLEMENTATION-STATUS.md.

## Phase C — cutover (one evening, ~1 h, low traffic, owner + me + lighthouse-ops on standby)
Pre-flight (day before): export Wix DNS screenshot; `dig` all 15 records; Vercel → Domains add `lpnfoundation.org` + `www`
(Vercel shows "invalid configuration" until DNS moves — expected); confirm Google Workspace MX/TXT present in Cloudflare.
1. Cloudflare DNS (zone still pending — edits are allowed): change `www` CNAME → `cname.vercel-dns.com` (DNS only),
   apex A → `76.76.21.21` (DNS only). Keep MX/TXT. Remove the Wix A/CNAME only.
2. Nameservers → Cloudflare. Two routes, owner's pick:
   - Wix: Domains → unassign the domain from the site (Wix warns the site goes offline — that IS the plan) → then change
     nameservers (in Wix if the domain is Wix-managed, else at Network Solutions).
   - Network Solutions directly (if LPN holds that login): set adi/cody.ns.cloudflare.com.
3. Wait: `dig NS`, `dig www` from 1.1.1.1 and 8.8.8.8; Vercel domain turns green and issues the certificate (≤ 10 min).
4. Verify: `curl -I https://www.lpnfoundation.org/th` → Vercel; /en; a /post/<slug>; /get-help; Google MX unchanged
   (`dig MX`); send a test email to an @lpnfoundation.org address.
5. Add the extra hostnames on the same zone: `intake` → tunnel (second public hostname; AUTH_URL switches to
   intake.lpnfoundation.org, staff re-login once), `guide` → Vercel Right Guide (+ 301 from lpnrightguide.site, 12 months).
Rollback: nameservers back to ns8/ns9.wixdns.net (Wix keeps the site for 30+ days if the plan is not cancelled) — minutes
to hours of DNS cache. Do NOT cancel Wix until 2 weeks after.

## Phase D — after
- Search Console: add the property, submit sitemap; watch 404s for 2 weeks; add 301s as they appear.
- Cancel Wix plan (owner) after 14 clean days. Update AGENTS.md §7 (website) + README map.
