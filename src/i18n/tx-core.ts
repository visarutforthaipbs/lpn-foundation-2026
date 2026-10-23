/**
 * Pure translation core shared by the server `tx` (src/i18n/tx.ts) and the client `useTx`
 * (src/i18n/tx-client.tsx). No JSON import here, so client bundles stay small.
 *
 * Keys are the exact English strings of the `en` branch; values are the draft translation.
 */
export type Dict = Record<string, string>

/** Strings that are not prose: paths, URLs, ids, codes, numbers, phone numbers, acronyms. */
export function isNonText(s: string): boolean {
  const t = s.trim()
  if (!t) return true
  if (!/[a-z]/.test(t)) return true // 'LPN', 'IOM', '2024', '+66 …', 'TH'
  if (/^(\/|#|https?:|mailto:|tel:|data:)/.test(t)) return true
  if (/^[a-z0-9_\-.:/#?=&@]+$/.test(t)) return true // 'other', 'pay-and-work', 'th-TH'
  if (/^[a-z]+[A-Z][A-Za-z0-9]*$/.test(t)) return true // camelCase keys, e.g. 'assistanceCentre'
  if (/\.(jpe?g|png|webp|svg|pdf)$/i.test(t)) return true // file names
  return false
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  if (v === null || typeof v !== 'object') return false
  if ('$$typeof' in (v as object)) return false // React element
  const proto = Object.getPrototypeOf(v)
  return proto === Object.prototype || proto === null
}

/** Deep-maps strings in `value` through `dict`; calls `onMissing` for prose without an entry. */
export function translateDeep<T>(dict: Dict, value: T, onMissing?: (s: string) => void): T {
  if (typeof value === 'string') {
    const hit = dict[value]
    if (hit) return hit as T
    if (onMissing && !isNonText(value)) onMissing(value)
    return value
  }
  if (Array.isArray(value)) return value.map((v) => translateDeep(dict, v, onMissing)) as T
  if (isPlainObject(value)) {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value)) out[k] = translateDeep(dict, v, onMissing)
    return out as T
  }
  return value
}

/** `{name}` placeholder formatting for strings that carry runtime values. */
export function fmt(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? String(vars[k]) : m))
}
