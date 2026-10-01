/**
 * One-time editorial cleanup of the Wix blog import in Payload.
 *
 * pnpm exec tsx src/seed/clean-blog-posts.ts            # preview changes
 * pnpm exec tsx src/seed/clean-blog-posts.ts --apply    # after pg_dump backup
 * pnpm exec tsx src/seed/clean-blog-posts.ts --check    # verify every post
 *
 * This intentionally never edits the Wix snapshot. It guards each block by
 * post ID, slug, original Lexical index and expected text before writing.
 */
import './loadenv'
import { getPayload } from 'payload'
import config from '../payload.config'
import { hasEmoji, stripEmoji, stripEmojiFromRichText } from '../lib/post-emoji'

type Locale = 'en' | 'th'
type Node = Record<string, unknown>
type RichText = { root: { children: Node[] } }
type Removal = [number, RegExp]

const plan: Record<number, { slug: string; remove: Removal[] }> = {
  9: {
    slug: 'เรื่องเล่าของการทำงานเพื',
    remove: [[42, /Bank Name/i], [43, /Account Name/i], [44, /Account Number/i], [45, /SWIFT Code/i]],
  },
  10: { slug: 'thailand-s-future-depend', remove: [[10, /Download the full report/i], [16, /^#MigrantRights/i]] },
  11: {
    slug: 'อนาคตของประเทศไทย-ขึ้นอย',
    remove: [[17, /เข้าถึงรายงานฉบับสมบูรณ์/u], [18, /ใส่ลิงก์ดาวน์โหลดที่นี่/u],
      [23, /ป้ายกำกับ/u], [24, /^#สิทธิแรงงานข้ามชาติ/u]],
  },
  12: {
    slug: 'lpn-เปิดตัวโครงการใหม่-ย',
    remove: [[22, /สนใจร่วมสนับสนุน/u], [23, /บริจาคได้ที่/u], [25, /ธนาคารกรุงไทย/u],
      [26, /บัญชี:/u], [27, /เลขที่บัญชี/u]],
  },
  13: {
    slug: 'เปิดโปงวิกฤตแรงงานข้ามชา',
    remove: [[10, /ดาวน์โหลดรายงานฉบับเต็ม/u], [13, /จากลิงก์ด้านล่าง/u], [18, /^#ยุติการค้ามนุษย์/u]],
  },
  25: { slug: 'lpn-sez-report', remove: [[15, /ดาวน์โหลดรายงานฉบับเต็ม/u]] },
  26: { slug: 'unveiling-the-realities', remove: [[9, /download and read this important report/i], [11, /Download the full report now/i]] },
  31: { slug: 'new-report-highlights-su', remove: [[13, /Download the full report here/i]] },
  59: { slug: 'lpntrainingandrehab', remove: [[32, /donate to the link below/i]] },
  62: { slug: 'lpnmigranttech', remove: [[24, /^#LABOURPROTECTIONNETWORK/i], [25, /^#COVID19/i]] },
  74: { slug: 'intern', remove: [[17, /^\s*#JOJOCOFFEE/i]] },
  81: {
    slug: 'bordermaesot',
    remove: [[32, /^Make a Donation/i], [33, /^Donations go directly/i],
      [34, /^Financial contributions can be transferred to/i], [36, /^Account Name/i],
      [37, /^Bank Name/i], [38, /^Branch/i], [39, /^Account Number/i]],
  },
}

function textOf(value: unknown): string {
  if (!value || typeof value !== 'object') return ''
  if (Array.isArray(value)) return value.map(textOf).join('')
  const node = value as Node
  return (typeof node.text === 'string' ? node.text : '') +
    Object.entries(node).filter(([key]) => key !== 'text').map(([, child]) => textOf(child)).join('')
}

function hasLinkOrUrl(value: unknown): boolean {
  if (!value || typeof value !== 'object') return false
  if (Array.isArray(value)) return value.some(hasLinkOrUrl)
  const node = value as Node
  if (node.type === 'link' || /https?:\/\/|www\./iu.test(typeof node.text === 'string' ? node.text : '')) return true
  return Object.values(node).some(hasLinkOrUrl)
}

function replaceBlockText(node: Node, before: RegExp, after: string) {
  let changed = 0
  function visit(value: unknown) {
    if (!value || typeof value !== 'object') return
    if (Array.isArray(value)) return value.forEach(visit)
    const item = value as Node
    if (typeof item.text === 'string' && before.test(item.text)) {
      item.text = item.text.replace(before, after)
      changed++
    }
    Object.values(item).forEach(visit)
  }
  visit(node)
  if (changed !== 1) throw new Error(`Expected one precise text replacement; got ${changed}`)
}

function cleanEditorialBlocks(id: number, slug: string, content: RichText): { content: RichText; removed: number[] } {
  const entry = plan[id]
  if (!entry) return { content, removed: [] }
  if (slug !== entry.slug) throw new Error(`Post ${id} slug changed: ${slug}`)
  const children = content.root.children
  for (const [index, pattern] of entry.remove) {
    const node = children[index]
    if (!node || !pattern.test(textOf(node))) throw new Error(`Post ${id} block ${index} no longer matches ${pattern}`)
    if (hasLinkOrUrl(node)) throw new Error(`Post ${id} block ${index} has a real link; review before removal`)
  }
  if (id === 9) {
    if (!/Contact and Donation Information/.test(textOf(children[35]))) throw new Error('Post 9 contact heading changed')
    if (!/Website: www\.lpnfoundation\.org Donation Details/.test(textOf(children[41]))) throw new Error('Post 9 mixed website paragraph changed')
    replaceBlockText(children[35], /Contact and Donation Information/, 'Contact Information')
    replaceBlockText(children[41], /\s*Donation Details[\s\S]*$/u, '')
  }
  const removed = entry.remove.map(([index]) => index)
  content.root.children = children.filter((_, index) => !removed.includes(index))
  return { content, removed }
}

function getVisibleText(post: { title?: string | null; excerpt?: string | null; meta?: { title?: string | null; description?: string | null } | null; content?: unknown }) {
  return [post.title || '', post.excerpt || '', post.meta?.title || '', post.meta?.description || '', textOf(post.content)].join('\n')
}

async function main() {
  const apply = process.argv.includes('--apply')
  const check = process.argv.includes('--check')
  if (apply && check) throw new Error('Choose --apply or --check')
  const payload = await getPayload({ config: await config })
  const posts = []
  for (const locale of ['en', 'th'] as Locale[]) {
    const result = await payload.find({ collection: 'posts', locale, fallbackLocale: false, depth: 0,
      draft: false, limit: 500, pagination: false })
    for (const doc of result.docs.filter((item) => item.language === locale)) {
      // Payload keeps an unpublished base row as well as the latest draft
      // version. Audit and clean what an editor actually sees in the admin.
      const current = doc._status === 'draft'
        ? await payload.findByID({ collection: 'posts', id: doc.id, locale,
          fallbackLocale: false, depth: 0, draft: true })
        : doc
      posts.push({ doc: current, locale })
    }
  }
  if (posts.length < 89) throw new Error(`Expected at least 89 migrated posts, found ${posts.length}`)
  let changed = 0
  let emojiBefore = 0
  for (const { doc, locale } of posts) {
    if (!doc.content?.root?.children) throw new Error(`Post ${doc.id} has no Lexical body`)
    const originalText = getVisibleText(doc)
    if (hasEmoji(originalText)) emojiBefore++
    if (check) continue
    const originalContent = JSON.stringify(doc.content)
    const { content, removed } = cleanEditorialBlocks(doc.id, doc.slug || '', structuredClone(doc.content) as RichText)
    const cleanedContent = stripEmojiFromRichText(content)
    const title = stripEmoji(doc.title || '')
    const excerpt = stripEmoji(doc.excerpt || '')
    const metaTitle = stripEmoji(doc.meta?.title || '')
    const metaDescription = stripEmoji(doc.meta?.description || '')
    const data: Record<string, unknown> = {}
    if (JSON.stringify(cleanedContent) !== originalContent) data.content = cleanedContent
    if (title !== doc.title) data.title = title
    if (excerpt !== (doc.excerpt || '')) data.excerpt = excerpt
    if (metaTitle !== (doc.meta?.title || '') || metaDescription !== (doc.meta?.description || '')) {
      data.meta = { ...doc.meta, title: metaTitle, description: metaDescription }
    }
    if (!Object.keys(data).length) continue
    changed++
    console.log(`${apply ? 'Updating' : 'Would update'} ${doc.id} ${locale} ${doc._status}: removed [${removed.join(', ')}]`)
    if (apply) await payload.update({ collection: 'posts', id: doc.id, locale,
      draft: doc._status === 'draft', data })
  }
  if (check) {
    const allText = posts.map(({ doc }) => getVisibleText(doc)).join('\n')
    if (emojiBefore) throw new Error(`${emojiBefore} posts still contain emoji`)
    if (/ใส่ลิงก์ดาวน์โหลดที่นี่|จากลิงก์ด้านล่าง|donate to the link below/iu.test(allText)) {
      throw new Error('An unfinished link placeholder remains')
    }
    if (/Account Number|เลขที่บัญชี|SWIFT Code/iu.test(allText)) {
      throw new Error('Unverified bank account text remains in a public post')
    }
  }
  console.log(`${posts.length} posts audited; ${emojiBefore} with emoji; ${changed} ${apply ? 'updated' : 'would update'}${check ? '; checks passed' : ''}.`)
  process.exit(0)
}

void main().catch((error) => { console.error(error); process.exit(1) })
