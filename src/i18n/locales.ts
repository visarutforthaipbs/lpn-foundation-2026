import type { Locale } from './routing'

/**
 * Per-locale metadata shared by server and client code (no translation data here).
 * `native` is the language's own name, shown in the language switcher.
 */
export const LOCALE_META: Record<Locale, { native: string; english: string; date: string; og: string }> = {
  en: { native: 'English', english: 'English', date: 'en', og: 'en_US' },
  th: { native: 'ไทย', english: 'Thai', date: 'th', og: 'th_TH' },
  // `-u-nu-latn`: month names in the language, digits stay 0–9 like every other number on the site.
  my: { native: 'မြန်မာ', english: 'Burmese', date: 'my-MM-u-nu-latn', og: 'my_MM' },
  km: { native: 'ខ្មែរ', english: 'Khmer', date: 'km-KH-u-nu-latn', og: 'km_KH' },
  lo: { native: 'ລາວ', english: 'Lao', date: 'lo-LA-u-nu-latn', og: 'lo_LA' },
}

/** Locales whose UI copy is a machine draft served from src/i18n/drafts/<locale>.json. */
export const DRAFT_LOCALES = ['my', 'km', 'lo'] as const
export type DraftLocale = (typeof DRAFT_LOCALES)[number]

export function isDraftLocale(locale: string): locale is DraftLocale {
  return (DRAFT_LOCALES as readonly string[]).includes(locale)
}

/** BCP-47 tag for toLocaleDateString / Intl (keeps en/th exactly as before). */
export function dateLocale(locale: string): string {
  return LOCALE_META[locale as Locale]?.date ?? locale
}
