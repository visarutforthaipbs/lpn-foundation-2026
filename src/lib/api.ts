import type { Where } from 'payload'
import { getPayloadClient } from './payload'
import type { Locale } from '@/i18n/routing'

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
