# LPN Right Guide — integration review

**Reviewed:** 30 September 2026

**Live product:** [รู้สิทธิ ติดกระเป๋า / Migrant Rights Guide](https://www.lpnrightguide.site/)

**Source:** [RFID-RIGHTS-LPN-2025](https://github.com/visarutforthaipbs/RFID-RIGHTS-LPN-2025)

**Deployment:** Vercel project `rfid-rights-lpn-2025`, serving the custom domain above.

## What exists

Right Guide is an LPN-branded, mobile-oriented rights companion, supported on its home page by LPN, International Justice Mission, and KOICA. It offers eight situation choices, search, 12 rights topics, a help directory, and settings for language and text size. A topic combines related law, rights, signs of a problem, self-help steps, and in some cases video or a source link. The visible language selector offers **Thai, English, and Burmese**. Khmer strings exist in source but are deliberately hidden until content is ready; Lao is not present. The [topic library](https://www.lpnrightguide.site/topics) covers work and wages, documents, health, child/family matters, safety, and exploitation. The [help page](https://www.lpnrightguide.site/help) lists LPN and external emergency/agency contacts. A separate `/volunteer` page collects applications.

The code is a separate Next.js 15 application deployed as a PWA. The 12 topic records and translations come from three committed CSV files. The app's API reads these files at runtime; there is no editor-facing review workflow or content update through the new website's Payload CMS. The manifest and `next-pwa` configuration indicate offline intent, but offline topic access was **not verified** in this review.

## Product decision

Treat Right Guide as the **“Know your rights” product within LPN’s worker journey**, with its own name and focused interface. The foundation website should own the orientation and direct-help route; the guide should own situation-based learning and self-help. A worker must always be able to go straight to an approved LPN contact without reading an article or completing a questionnaire.

For the first release, keep the guide as its own application so the current situation flow and PWA packaging are preserved. Make it first-class in the main site's navigation, Home help panel, Get Help page, and relevant work pages. Use a distinct action such as **“Explore the Rights Guide / รู้สิทธิ ติดกระเป๋า”**, opening the guide directly at the relevant situation or topic when a stable URL is available. Do not iframe it. Use `guide.lpnfoundation.org` as the preferred canonical subdomain after LPN domain/DNS control and route testing; until then, use `lpnrightguide.site` with clear LPN branding. Keep existing guide URLs working with redirects if the domain changes.

This is one LPN user journey across two deployments, not two competing help systems. A later release can move approved topic content into Payload or a shared publication API **after** the legal/editorial review model is settled. A code merge is not a launch requirement.

## Findings to resolve before prominent cross-linking

| Priority | Observation | Required resolution |
| --- | --- | --- |
| Launch | The guide prominently calls `084-121-1609`; the new site's Burmese contact is `0963812069`. These may be different channels, but their purpose, languages, availability, and owners are not labelled consistently across products. | LPN verifies every public number, its language and hours. Publish one shared contact registry or an automated cross-site check; use locale-appropriate labels and a visible review date. |
| Launch | The Burmese situation warning prints `၁၉၆၄` (1964), while the guide's help directory and other language warning use `1694`. | Correct the Burmese digits after verifying the intended agency number; test every emergency/help number in every published language. |
| Launch | Rights advice is published from CSV without per-topic legal reviewer, source version, effective date, or next review date. On the first topic, one sentence about employer-held documents reads ambiguously and could be understood as permitting retention. | LPN/legal reviewer checks all 12 topics in each published language; correct ambiguous or outdated advice, record sources and review dates, and establish an urgent correction/unpublish process. Do not assume translation equivalence. |
| Launch | The live custom domain publishes canonical, Open Graph, structured-data, and sitemap URLs pointing to `rfid-rights.vercel.app`; language alternates also point to one unlocalised URL. A topic's browser title briefly reported “not found” while the article body loaded. | Use the real canonical domain, verify server-rendered topic metadata/status, and choose a URL strategy for three languages before indexing or domain migration. |
| Launch | The guide labels itself an offline guide and has a PWA service-worker configuration, but topic pages fetch `/api/topics` with `cache: no-store`. | Test first visit, installed PWA, repeat visit, offline home/topic/help, app update, and recovery. Claim offline access only for routes that work without a connection; keep emergency numbers available offline if promised. |
| Launch | Source code enables Google Analytics and includes an RFID `uid` query parameter that is SHA-256 hashed for a separate optional analytics event. A raw UID in a page URL may still reach analytics via page-location reporting, browser history, or referrers. | Review the complete data flow and consent/retention policy; avoid putting identifiable UIDs in URLs or transmitting stable per-person hashes to analytics. Do not pass sensitive case context from the main site. |
| Follow-up | Khmer UI strings exist but Khmer is hidden; Lao is absent. | Describe the guide as Thai/English/Burmese only until full content is reviewed. Plan other languages from actual worker needs and translation capacity. |
| Follow-up | `/volunteer` collects name, age, nationality, address, phone and other details into Supabase. | Treat volunteer recruitment as a separate supporter/community flow; review privacy notice, access, retention, and staff ownership before linking it prominently. |

## Integration acceptance tests

- From the foundation Home and Get Help pages, a worker can choose **direct help** or **learn rights** without confusing one with the other. The direct contact is never behind Right Guide.
- A Thai, English, or Burmese visitor lands in the intended guide language or sees an obvious language switch. No Khmer/Lao claim appears before approved content exists.
- LPN-approved contact records match in both products, and phone links work on mobile. A scheduled review or automated check catches drift.
- Each of the 12 published topics shows a visible reviewed date, source, and correction/contact route after editorial remediation; translations are checked separately.
- Scenario selection, search, topic deep links, back navigation, text sizing, and emergency exits work at mobile widths and with keyboard/screen reader.
- Offline behavior is tested on an actual mobile device or equivalent browser isolation before “works offline” is advertised.
- Canonical URLs, sitemap entries, language metadata, and old links resolve correctly after any domain change.
- Analytics contain no case descriptions, raw RFID identifiers, stable person-level hashes, or sensitive query parameters.

## Source pointers

- [Topic API and CSV mapping](https://github.com/visarutforthaipbs/RFID-RIGHTS-LPN-2025/blob/main/src/app/api/topics/route.ts)
- [Topic page and runtime loading](https://github.com/visarutforthaipbs/RFID-RIGHTS-LPN-2025/blob/main/src/app/topic/%5Bslug%5D/page.tsx)
- [Language selector](https://github.com/visarutforthaipbs/RFID-RIGHTS-LPN-2025/blob/main/src/app/components/LanguageSwitcher.tsx)
- [PWA configuration](https://github.com/visarutforthaipbs/RFID-RIGHTS-LPN-2025/blob/main/next.config.ts)
- [Guide metadata](https://github.com/visarutforthaipbs/RFID-RIGHTS-LPN-2025/blob/main/src/app/layout.tsx)
- [RFID analytics path](https://github.com/visarutforthaipbs/RFID-RIGHTS-LPN-2025/blob/main/src/app/page.tsx)
- [Volunteer form](https://github.com/visarutforthaipbs/RFID-RIGHTS-LPN-2025/blob/main/src/app/volunteer/page.tsx)
