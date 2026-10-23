import my from './drafts/my.json'
import km from './drafts/km.json'
import lo from './drafts/lo.json'
import { isDraftLocale, type DraftLocale } from './locales'
import { translateDeep, type Dict } from './tx-core'

export { fmt } from './tx-core'

/**
 * Locale-aware copy picker that replaces the old `th ? A : B` ternaries.
 *   th        → thValue
 *   en        → enValue
 *   my/km/lo  → enValue with every English string replaced from src/i18n/drafts/<locale>.json
 *               (machine drafts, pending native-speaker review — see src/i18n/review.ts).
 * A string with no entry falls back to English; in dev it is appended (deduped) to
 * src/i18n/drafts/_missing.txt so it can be translated.
 */
const DICTS: Record<DraftLocale, Dict> = { my, km, lo }

const IS_DEV = process.env.NODE_ENV === 'development'
let seen: Set<string> | null = null

function logMissing(locale: string, s: string) {
  if (!IS_DEV || typeof window !== 'undefined') return
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require('node:fs') as typeof import('node:fs')
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const path = require('node:path') as typeof import('node:path')
    const file = path.join(process.cwd(), 'src/i18n/drafts/_missing.txt')
    if (!seen) {
      seen = new Set(fs.existsSync(file) ? fs.readFileSync(file, 'utf8').split('\n').filter(Boolean) : [])
    }
    const line = JSON.stringify(s)
    if (seen.has(line)) return
    seen.add(line)
    fs.appendFileSync(file, line + '\n')
    void locale
  } catch {
    /* logging is best-effort */
  }
}

export function draftDict(locale: string): Dict {
  return isDraftLocale(locale) ? DICTS[locale] : {}
}

export function tx<T>(locale: string, thValue: T, enValue: T): T {
  if (locale === 'th') return thValue
  if (!isDraftLocale(locale)) return enValue
  return translateDeep(DICTS[locale], enValue, (s) => logMissing(locale, s))
}

/**
 * For CMS values on draft locales: Payload already fell back to English, so map
 * the English text through the same dictionary when an entry exists. Never logs
 * (CMS bodies are edited in /admin, not in the drafts JSON).
 */
export function txCms<T>(locale: string, value: T): T {
  if (!isDraftLocale(locale)) return value
  return translateDeep(DICTS[locale], value)
}
