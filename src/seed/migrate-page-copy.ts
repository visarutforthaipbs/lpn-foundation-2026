/** Move Wix page copy into Payload pages, preserving the complete source text.
 *
 * The full source is kept in a non-rendered block for editorial reference. A
 * selected set of substantive sections is rendered inside the redesigned pages.
 * Historical news/partner material is labelled as such; outdated screenings,
 * phone numbers and payment instructions are excluded from public copy.
 */
import './loadenv'
import { readFile } from 'node:fs/promises'
import { getPayload } from 'payload'
import config from '../payload.config'
import { heading, lexical, para } from './lexical'

type SourceSection = { id: string; text: string; links: string[] }
type SourcePage = { slug: string; sourceUrl: string; sections: SourceSection[] }

const choices: Record<string, { title: string; indices: number[] }> = {
  home: { title: 'Understanding forced labour at sea', indices: [0, 1, 3, 4, 5, 9, 14, 15, 16, 17, 22] },
  about: { title: 'How LPN works', indices: [2, 3, 4, 7, 14, 15, 16, 17, 20, 24, 26, 28, 31] },
  team: { title: 'The people behind LPN', indices: [0, 3, 4, 6, 7, 8, 10, 11, 12, 13] },
  services: { title: 'Our programmes in detail', indices: [1, 9, 11, 13] },
  projects: { title: 'Past partners and programmes', indices: [...Array.from({ length: 27 }, (_, i) => i + 1)] },
  'ghost-fleet': { title: 'About the film', indices: [0, 1, 2] },
  news: { title: 'Earlier coverage and publications', indices: [1, ...Array.from({ length: 20 }, (_, i) => i + 3)] },
  contact: { title: 'How to reach LPN', indices: [1, 4] },
  donate: { title: 'Ways to support LPN', indices: [0, 1, 4, 5] },
}

// Thai copy is kept in distinct blocks because Payload's page layout is shared
// across locales. Sections already present in the redesigned pages stay there.
const thaiChoices: Record<string, { title: string; indices: number[] }> = {
  about: { title: 'การละเมิดสิทธิและแนวทางการทำงานของ LPN', indices: [7, 14, 15, 16, 17, 20, 24, 26, 28, 31] },
  team: { title: 'เรื่องราวของทีมงาน LPN', indices: [4, 7, 11, 13] },
  'ghost-fleet': { title: 'เกี่ยวกับภาพยนตร์ Ghost Fleet', indices: [0, 1, 2] },
  news: { title: 'ข่าวและสิ่งพิมพ์ที่ผ่านมา', indices: [1, ...Array.from({ length: 20 }, (_, i) => i + 3)] },
}

const clean = (value: string) =>
  value
    .replace(/\u0000|\u200b/g, '')
    .replace(/\+66 34 434 726/g, '0963812069')
    .replace(/[ \t]+/g, ' ')
    .trim()

const linkParagraph = (url: string) => ({
  type: 'paragraph',
  version: 1,
  direction: 'ltr',
  format: '',
  indent: 0,
  textFormat: 0,
  children: [{
    type: 'link',
    version: 3,
    fields: { linkType: 'custom', url, newTab: true },
    direction: 'ltr',
    format: '',
    indent: 0,
    children: [{ type: 'text', version: 1, text: url, detail: 0, format: 0, mode: 'normal', style: '' }],
  }],
})

function visibleNodes(section: SourceSection) {
  const lines = clean(section.text).split('\n').map(clean).filter(Boolean)
  if (!lines.length) return []
  const nodes = lines.length <= 4 && lines.join(' ').length < 100
    ? [heading(lines.join(' '), 'h3')]
    : lines.map((line) =>
        line.length < 90 && line.split(/\s+/).length < 13 && !/[.!?]$/.test(line)
          ? heading(line, 'h3')
          : para(line),
      )
  for (const url of [...new Set(section.links)]) {
    if (/^https?:\/\//i.test(url)) nodes.push(linkParagraph(url))
  }
  return nodes
}

async function main() {
  const dryRun = process.argv.includes('--dry-run')
  const localeArg = process.argv.find((arg) => arg.startsWith('--locale='))
  const locale = localeArg?.slice('--locale='.length) ?? 'en'
  if (locale !== 'en' && locale !== 'th') throw new Error(`Unsupported locale: ${locale}`)
  const onlyArg = process.argv.find((arg) => arg.startsWith('--only='))
  const onlySlug = onlyArg?.slice('--only='.length)
  const snapshot = locale === 'th' ? 'src/seed/wix-pages.th.snapshot.json' : 'src/seed/wix-pages.snapshot.json'
  const pages = JSON.parse(await readFile(snapshot, 'utf8')) as SourcePage[]
  const payload = await getPayload({ config: await config })
  let updated = 0
  for (const source of pages) {
    if (onlySlug && source.slug !== onlySlug) continue
    const choice = (locale === 'th' ? thaiChoices : choices)[source.slug]
    if (!source.sections.length) continue // Wix's events page contains no editorial copy.
    const found = await payload.find({ collection: 'pages', locale, depth: 0, limit: 1, where: { slug: { equals: source.slug } } })
    const page = found.docs[0]
    if (!page) throw new Error(`Missing Payload page: ${source.slug}`)
    const archiveName = locale === 'th' ? 'Wix source archive (th)' : 'Wix source archive'
    const integratedName = locale === 'th' ? 'Wix integrated copy (th)' : 'Wix integrated copy'
    const existing = (page.layout || []).filter((block) => ![archiveName, integratedName].includes(block.blockName || ''))
    const archive = {
      blockType: 'richText' as const,
      blockName: archiveName,
      content: lexical([
        heading(`Original Wix page copy (${locale}): ${source.slug}`),
        para(`Source: ${source.sourceUrl}. Historical contact and payment details require review.`),
        ...source.sections.flatMap((section) => [
          para(clean(section.text).replace(/\n/g, ' ')),
          ...section.links.filter((url) => /^https?:\/\//i.test(url)).map(linkParagraph),
        ]),
      ]),
    }
    const integrated = choice && {
      blockType: 'richText' as const,
      blockName: integratedName,
      content: lexical([
        heading(choice.title),
        ...choice.indices.flatMap((index) => source.sections[index] ? visibleNodes(source.sections[index]) : []),
      ]),
    }
    if (dryRun) {
      payload.logger.info(`Would update ${source.slug} (${locale}): archive ${source.sections.length} sections, integrate ${choice?.indices.length ?? 0}`)
      continue
    }
    await payload.update({ collection: 'pages', id: page.id, locale, data: { layout: [...existing, archive, ...(integrated ? [integrated] : [])] } })
    updated++
    payload.logger.info(`Updated ${source.slug} (${locale}): ${source.sections.length} archived, ${choice?.indices.length ?? 0} integrated sections`)
  }
  payload.logger.info(`Done: ${updated} pages updated${dryRun ? ' (dry run)' : ''}`)
  process.exit(0)
}

void main()
