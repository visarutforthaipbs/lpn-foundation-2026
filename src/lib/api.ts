import type { Where } from 'payload'
import { getPayloadClient } from './payload'
import type { Locale } from '@/i18n/routing'
import type { Media } from '@/payload-types'

const published: Where = { _status: { equals: 'published' } }

export async function getHeader(locale: Locale) {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'header', locale, depth: 1 })
}

export async function getFooter(locale: Locale) {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'footer', locale, depth: 1 })
}

export async function getPage(slug: string, locale: Locale) {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'pages',
    locale,
    depth: 2,
    limit: 1,
    where: { and: [{ slug: { equals: slug } }, published] },
  })
  return docs[0] ?? null
}

export async function getAllPageSlugs() {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'pages',
    depth: 0,
    limit: 200,
    where: published,
    select: { slug: true },
  })
  return docs.map((d) => d.slug).filter(Boolean) as string[]
}

export async function getPosts(locale: Locale, opts: { categorySlug?: string; limit?: number } = {}) {
  const payload = await getPayloadClient()
  // Each locale's blog shows only posts authored in that language.
  const and: Where[] = [published, { language: { equals: locale } }]
  if (opts.categorySlug) {
    and.push({ 'category.slug': { equals: opts.categorySlug } })
  }
  return payload.find({
    collection: 'posts',
    locale,
    depth: 2,
    limit: opts.limit ?? 100,
    sort: '-publishedAt',
    where: { and },
    select: {
      title: true,
      slug: true,
      excerpt: true,
      publishedAt: true,
      category: true,
      coverImage: true,
    },
  })
}

export async function getPost(slug: string, locale: Locale) {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'posts',
    locale,
    depth: 2,
    limit: 1,
    where: { and: [{ slug: { equals: slug } }, published] },
  })
  return docs[0] ?? null
}

export async function getAllPostSlugs() {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'posts',
    depth: 0,
    limit: 500,
    where: published,
    select: { slug: true, language: true },
  })
  return docs
    .filter((d) => d.slug)
    .map((d) => ({ slug: d.slug as string, language: (d.language as Locale) ?? 'en' }))
}

export async function getCategories(locale: Locale) {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({ collection: 'categories', locale, depth: 0, limit: 50 })
  return docs
}

export async function getTeam(locale: Locale) {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'teamMembers',
    locale,
    depth: 1,
    limit: 200,
    sort: 'order',
  })
  return docs
}

export async function getReports(locale: Locale) {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'reports', locale, fallbackLocale: false, depth: 1, limit: 100,
    sort: '-year', where: published,
  })
  return docs.filter((doc) => doc.title && doc.summary)
}

export async function getImpactMetrics(locale: Locale) {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'impact-metrics', locale, fallbackLocale: false, depth: 1, limit: 100,
    sort: 'order', where: published,
  })
  return docs.filter((doc) => doc.label && doc.unit && doc.periodLabel && doc.definition)
}

export async function getStories(locale: Locale) {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'stories', locale, fallbackLocale: false, depth: 1, limit: 100,
    sort: '-storyDate',
    where: { and: [published, { consentStatus: { equals: 'approved' } }] },
  })
  return docs.filter((doc) => doc.title && doc.summary && doc.content)
}

export async function getStory(slug: string, locale: Locale) {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'stories', locale, fallbackLocale: false, depth: 2, limit: 1,
    where: { and: [published, { consentStatus: { equals: 'approved' } }, { slug: { equals: slug } }] },
  })
  return docs.find((doc) => doc.title && doc.summary && doc.content) ?? null
}

export async function getMediaById(id: number): Promise<Media | null> {
  const payload = await getPayloadClient()
  try {
    return (await payload.findByID({ collection: 'media', id, depth: 0 })) as Media
  } catch {
    return null
  }
}

/**
 * Editorial images used by the hand-built pages. Keyed by Payload filename, not
 * row ID, so pages keep their images when the database is re-seeded or cloned.
 */
export const SITE_MEDIA = {
  assistanceCentre: 'd6c8d1_6042b9358fde4e0894a61b005b95c57d_mv2-7.jpg',
  trainingCentre: 'd90624_f19e0c74863d4b18b4b511304872bc17_mv2-V0AF88o2gf7pWVxWtQRljOdfqJVXyJ.jpg',
  familyHome: '72011e_1e727aa47c4a4156afe2c44c36349674_mv2_d_4893_3262_s_4_2-wxLtzd2ii5k38FoO59Bi3GRvsYEFjm.jpg',
  patima: 'd6c8d1_9595357407c44b0a812e5807508cc7ea_mv2-mCSnvguSXqnHD9Zuielutn8jbq5fAl.jpg',
  sompong: 'd6c8d1_fc19f203584146e1905019bbff5a2f1a_mv2_d_2560_1420_s_2-hTdpRb08hhyEpyuTdz9eLy8bH6NAsv.png',
  projectLaunch: 'd90624_0bba1bd8f67544eb888f06f923981aa0_mv2-5-phG8UoxZP3AUjY91WDY4RFqygVDvgy.jpg',
} as const

export type SiteMediaKey = keyof typeof SITE_MEDIA

export async function getSiteMedia(): Promise<Partial<Record<SiteMediaKey, Media>>> {
  const payload = await getPayloadClient()
  const filenames = Object.values(SITE_MEDIA)
  try {
    const { docs } = await payload.find({
      collection: 'media',
      where: { filename: { in: filenames } },
      depth: 0,
      limit: filenames.length,
    })
    const byFilename = new Map((docs as Media[]).map((d) => [d.filename, d]))
    const map: Partial<Record<SiteMediaKey, Media>> = {}
    for (const [key, filename] of Object.entries(SITE_MEDIA) as [SiteMediaKey, string][]) {
      const doc = byFilename.get(filename)
      if (doc) map[key] = doc
    }
    return map
  } catch {
    return {}
  }
}
