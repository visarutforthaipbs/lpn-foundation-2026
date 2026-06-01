/**
 * Migrate ALL blog posts from the live Wix site via the Wix Blog REST API.
 *
 *   pnpm migrate:blog            # import every published post (EN + TH)
 *   pnpm migrate:blog <count>    # import only the first <count> (for testing)
 *
 * Requires WIX_API_KEY and WIX_SITE_ID in .env (gitignored). Imports each post
 * into its own language: EN posts use the `en` locale, TH posts the `th` locale,
 * with the `language` field set so each locale's blog lists only its own posts.
 * Rich content (Ricos) is converted to Lexical; images upload to Payload media.
 * Idempotent: matched by slug.
 */
import 'dotenv/config'
import { getPayload, type Payload } from 'payload'
import config from '../payload.config'
import { ricosToLexical } from './ricos'
import { formatSlug } from '../fields/slug'

const KEY = process.env.WIX_API_KEY
const SITE = process.env.WIX_SITE_ID
const API = 'https://www.wixapis.com/blog/v3'
const H = { Authorization: KEY || '', 'wix-site-id': SITE || '', 'Content-Type': 'application/json' }
const wixImageUrl = (id: string) => `https://static.wixstatic.com/media/${id}`

async function wix(path: string) {
  const r = await fetch(`${API}${path}`, { headers: H })
  if (!r.ok) throw new Error(`Wix ${r.status} ${path}: ${(await r.text()).slice(0, 120)}`)
  return r.json()
}

async function listAllPosts() {
  const all: any[] = []
  let offset = 0
  for (;;) {
    const j = await wix(`/posts?paging.limit=100&paging.offset=${offset}`)
    all.push(...(j.posts || []))
    if (!j.posts?.length || all.length >= (j.metaData?.total ?? all.length)) break
    offset += 100
  }
  return all
}

async function main() {
  if (!KEY || !SITE) throw new Error('Set WIX_API_KEY and WIX_SITE_ID in .env')
  const payload: Payload = await getPayload({ config: await config })

  const limit = process.argv[2] ? Number(process.argv[2]) : Infinity
  const posts = (await listAllPosts()).slice(0, limit)
  payload.logger.info(`Found ${posts.length} posts to import`)

  // Category map: Wix categoryId -> { label, language }
  const catData = await wix('/categories?paging.limit=100').catch(() => ({ categories: [] }))
  const wixCats = new Map<string, { label: string; language: string }>()
  for (const c of catData.categories || []) wixCats.set(c.id, { label: c.label, language: c.language })

  const authorCache = new Map<string, number>() // memberId -> payload author id
  const mediaCache = new Map<string, number>() // wix media id -> payload media id
  const catCache = new Map<string, number>() // payload category slug -> id

  const uploadImage = async (wixId: string, alt: string): Promise<number | undefined> => {
    if (mediaCache.has(wixId)) return mediaCache.get(wixId)
    const filename = `${wixId.replace(/[^\w.]/g, '_')}`
    try {
      const existing = await payload.find({
        collection: 'media',
        where: { filename: { equals: filename } },
        limit: 1,
      })
      if (existing.docs[0]) {
        mediaCache.set(wixId, existing.docs[0].id)
        return existing.docs[0].id
      }

      const res = await fetch(wixImageUrl(wixId))
      const buf = Buffer.from(await res.arrayBuffer())
      const ext = wixId.split('.').pop()?.split('~')[0] || 'jpg'
      const media = await payload.create({
        collection: 'media',
        data: { alt: alt || 'LPN Foundation' },
        file: { data: buf, mimetype: `image/${ext === 'png' ? 'png' : 'jpeg'}`, name: filename, size: buf.length },
      })
      mediaCache.set(wixId, media.id)
      return media.id
    } catch (e) {
      payload.logger.warn(`image upload failed (${wixId}): ${(e as Error).message}`)
      return undefined
    }
  }

  const resolveAuthor = async (memberId?: string): Promise<number | undefined> => {
    if (!memberId) return undefined
    if (authorCache.has(memberId)) return authorCache.get(memberId)
    let name = 'LPN Foundation'
    try {
      const m = await (await fetch(`https://www.wixapis.com/members/v1/members/${memberId}`, { headers: H })).json()
      name = m.member?.profile?.nickname || m.member?.profile?.name || name
    } catch {
      /* fallback */
    }
    const found = await payload.find({ collection: 'authors', where: { name: { equals: name } }, limit: 1 })
    const id = found.docs[0]?.id ?? (await payload.create({ collection: 'authors', data: { name } })).id
    authorCache.set(memberId, id)
    return id
  }

  const resolveCategory = async (categoryIds: string[] = [], locale: 'en' | 'th'): Promise<number | undefined> => {
    const first = categoryIds.map((id) => wixCats.get(id)).find(Boolean)
    if (!first) return undefined
    const slug = formatSlug(first.label)
    if (catCache.has(slug)) return catCache.get(slug)
    const found = await payload.find({ collection: 'categories', where: { slug: { equals: slug } }, limit: 1 })
    const id =
      found.docs[0]?.id ??
      (await payload.create({ collection: 'categories', locale, data: { title: first.label, slug } })).id
    catCache.set(slug, id)
    return id
  }

  let ok = 0
  for (const summary of posts) {
    const locale = (summary.language === 'th' ? 'th' : 'en') as 'en' | 'th'
    const slug = formatSlug(summary.slug)
    try {
      const existing = await payload.find({ collection: 'posts', where: { slug: { equals: slug } }, limit: 1 })
      if (existing.docs[0]) {
        ok++
        payload.logger.info(`[${ok}/${posts.length}] Skipping existing post: ${slug}`)
        continue
      }

      const detail = await wix(`/posts/${summary.id}?fieldsToInclude=RICH_CONTENT`)
      const post = detail.post || detail

      const coverWixId = post.media?.wixMedia?.image?.id
      const [author, category, coverImage, content] = await Promise.all([
        resolveAuthor(post.memberId),
        resolveCategory(post.categoryIds, locale),
        coverWixId ? uploadImage(coverWixId, post.title || '') : Promise.resolve(undefined),
        ricosToLexical(post.richContent, uploadImage),
      ])

      const data = {
        title: post.title || slug,
        slug,
        language: locale,
        excerpt: post.excerpt || '',
        publishedAt: post.firstPublishedDate || undefined,
        author,
        category,
        coverImage,
        content: content as never,
        _status: 'published' as const,
      }

      await payload.create({ collection: 'posts', locale, data })
      ok++
      payload.logger.info(`[${ok}/${posts.length}] ${locale} ${slug.slice(0, 50)}`)
    } catch (e) {
      payload.logger.error(`FAILED ${locale} ${slug}: ${(e as Error).message}`)
    }
  }

  payload.logger.info(`Done. Imported ${ok}/${posts.length}.`)
  process.exit(0)
}

void main()
