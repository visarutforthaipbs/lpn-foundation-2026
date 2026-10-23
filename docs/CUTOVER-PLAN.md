# www.lpnfoundation.org — cutover plan (Wix → Vercel), owner-paced

Today: `www.lpnfoundation.org` = Wix (DNS ns8/ns9.wixdns.net, registrar Network Solutions). The new site is complete
at `lpn-foundation-2026.vercel.app` (One CI shipped 23 Oct; help form PR #4 pending). The Cloudflare zone
`lpnfoundation.org` exists (pending) with all 15 Wix records copied. Wix refuses a nameserver change while the domain is
"assigned" to the Wix site → **the DNS move IS the website cutover.** No half-way state exists.

## Phase A — finish the site (code: this week)
- [ ] merge website PR #4 (help form → intake API) — owner "merge"
- [ ] legacy Wix URL map: crawl the live Wix sitemap, add 301s for anything not already covered (DEPLOY.md §5 URL continuity)
- [ ] hotline block = the 4 numbers Wix shows today (TH 084-121-1609, KM 085-534-1595, LO 092-321-1516, MY 034-434-726)
      — the Payload `help channels` global currently shows Burmese 0963812069; LPN to confirm which is right (NEEDS E6)
- [ ] intake links: Get Help page "ส่งเสียง" → `https://www.lpnrightguide.site/voice-report` (later guide.lpnfoundation.org)
- [ ] run `scripts/health_check.py` + HIG matrix one last time on the preview; Lighthouse mobile ≥ 90 perf on /th

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
