import type { Field } from 'payload'

export const formatSlug = (val: string): string =>
  val
    .toLowerCase()
    .trim()
    // Keep Unicode letters/numbers/marks (Thai vowel & tone marks are \p{M}, so
    // they must be allowed or Thai-script slugs get mangled) + spaces/hyphens.
    .replace(/[^\p{L}\p{N}\p{M}\s-]/gu, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')

/**
 * Reusable, non-localized slug field. A single canonical slug per document keeps
 * URLs and redirects simple. Auto-fills from `source` (default "title") when left
 * blank; for Thai-only titles the editor must type a slug (latin chars strip out).
 */
export const slugField = (source = 'title'): Field => ({
  name: 'slug',
  type: 'text',
  index: true,
  unique: true,
  required: true,
  admin: {
    position: 'sidebar',
    description: 'URL path segment. Auto-generated from the title if left blank.',
  },
  hooks: {
    beforeValidate: [
      ({ value, data }) => {
        if (typeof value === 'string' && value.length > 0) return formatSlug(value)
        const fallback = data?.[source]
        if (typeof fallback === 'string' && fallback.length > 0) return formatSlug(fallback)
        return value
      },
    ],
  },
})
