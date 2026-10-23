import type { MetadataRoute } from 'next'
import { routing } from '@/i18n/routing'
import { getAllPageSlugs, getAllPostSlugs, getStories } from '@/lib/api'
import { SITE_URL } from '@/lib/seo'
import { isReviewed } from '@/i18n/review'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [pageSlugs, posts, englishStories, thaiStories] = await Promise.all([
    getAllPageSlugs(), getAllPostSlugs(), getStories('en'), getStories('th'),
  ])
  const entries: MetadataRoute.Sitemap = []

  // Shared paths (home, blog, pages) exist in both locales with hreflang alternates.
  const shared = new Set<string>(['', '/blog', '/get-help', '/our-work', '/impact', '/stories', '/donate', '/contact'])
  for (const s of pageSlugs) if (s !== 'home') shared.add(`/${s}`)
  for (const p of shared) {
    // Unreviewed machine-draft locales (my/km/lo) stay out until signed off — src/i18n/review.ts.
    const indexed = routing.locales.filter((l) => isReviewed(l))
    const languages = Object.fromEntries(indexed.map((l) => [l, `${SITE_URL}/${l}${p}`]))
    for (const locale of indexed) {
      entries.push({ url: `${SITE_URL}/${locale}${p}`, changeFrequency: 'weekly', alternates: { languages } })
    }
  }

  // Posts live under their own language only.
  for (const { slug, language } of posts) {
    entries.push({ url: `${SITE_URL}/${language}/post/${encodeURIComponent(slug)}`, changeFrequency: 'monthly' })
  }
  const storyLocales = new Map<string, string[]>()
  for (const story of englishStories) storyLocales.set(story.slug, ['en'])
  for (const story of thaiStories) storyLocales.set(story.slug, [...(storyLocales.get(story.slug) ?? []), 'th'])
  for (const [slug, locales] of storyLocales) {
    const languages = Object.fromEntries(locales.map((locale) => [locale, `${SITE_URL}/${locale}/stories/${encodeURIComponent(slug)}`]))
    for (const locale of locales) entries.push({ url: `${SITE_URL}/${locale}/stories/${encodeURIComponent(slug)}`, changeFrequency: 'monthly', alternates: { languages } })
  }
  return entries
}
