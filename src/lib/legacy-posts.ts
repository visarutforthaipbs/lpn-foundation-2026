import wixPosts from '@/seed/wix-blog-urls.json'
import { formatSlug } from '@/fields/slug'
import type { Locale } from '@/i18n/routing'

// Wix article URLs often have longer or differently punctuated slugs than the
// Payload routes. Preserve those links after the domain moves to this site.
const legacySlugs = new Map(
  wixPosts.map(({ slug, language }) => [`${language}:${slug}`, formatSlug(slug)]),
)

export function legacyPostDestination(slug: string, locale: Locale): string | undefined {
  const canonical = legacySlugs.get(`${locale}:${slug}`)
  return canonical && canonical !== slug ? `/${locale}/post/${encodeURIComponent(canonical)}` : undefined
}
