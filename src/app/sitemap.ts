import type { MetadataRoute } from 'next'
import { routing } from '@/i18n/routing'
import { getAllPageSlugs, getAllPostSlugs } from '@/lib/api'
import { SITE_URL } from '@/lib/seo'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [pageSlugs, posts] = await Promise.all([getAllPageSlugs(), getAllPostSlugs()])
  const entries: MetadataRoute.Sitemap = []

  // Shared paths (home, blog, pages) exist in both locales with hreflang alternates.
  const shared = new Set<string>(['', '/blog'])
  for (const s of pageSlugs) if (s !== 'home') shared.add(`/${s}`)
  for (const p of shared) {
    const languages = Object.fromEntries(routing.locales.map((l) => [l, `${SITE_URL}/${l}${p}`]))
    for (const locale of routing.locales) {
      entries.push({ url: `${SITE_URL}/${locale}${p}`, changeFrequency: 'weekly', alternates: { languages } })
    }
  }

  // Posts live under their own language only.
  for (const { slug, language } of posts) {
    entries.push({ url: `${SITE_URL}/${language}/post/${slug}`, changeFrequency: 'monthly' })
  }
  return entries
}
