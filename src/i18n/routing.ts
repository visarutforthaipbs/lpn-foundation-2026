import { defineRouting } from 'next-intl/routing'

// Mirrors the existing Wix URL scheme: /en/... and /th/...; my (Burmese), km (Khmer)
// and lo (Lao) are machine-draft UI translations — see src/i18n/tx.ts and review.ts.
// `defaultLocale` matches Payload's defaultLocale ('en'). Flip to 'th' here and
// in payload.config.ts if you want Thai as the primary locale.
export const routing = defineRouting({
  locales: ['en', 'th', 'my', 'km', 'lo'],
  defaultLocale: 'en',
  localePrefix: 'always',
})

export type Locale = (typeof routing.locales)[number]
