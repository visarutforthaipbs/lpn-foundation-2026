import type { Locale } from './routing'

/**
 * Native-speaker review status per locale. While a locale is `false`:
 *  - every page carries `<meta name="robots" content="noindex">`,
 *  - a slim "draft translation" notice renders under the header,
 *  - the locale is left out of hreflang alternates and the sitemap.
 * Flip to `true` only after LPN staff / interpreters have signed off the
 * reviewed columns in docs/translations/lpn-website-translations.csv and
 * `python3 scripts/import_translations.py` has been run.
 */
export const REVIEWED: Record<Locale, boolean> = {
  en: true,
  th: true,
  my: false,
  km: false,
  lo: false,
}

export function isReviewed(locale: string): boolean {
  return REVIEWED[locale as Locale] === true
}
