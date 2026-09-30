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

export async function getMediaByIds(ids: number[]): Promise<Record<number, Media>> {
  if (!ids.length) return {}
  const payload = await getPayloadClient()
  try {
    const { docs } = await payload.find({
      collection: 'media',
      where: { id: { in: ids } },
      depth: 0,
      limit: ids.length,
    })
    const map: Record<number, Media> = {}
    for (const d of docs as Media[]) {
      map[d.id] = d
    }
    return map
  } catch {
    return {}
  }
}
