/** Apply the current Burmese hotline to existing Payload globals and pages. */
import './loadenv'
import { getPayload } from 'payload'
import config from '../payload.config'

const OLD = '+66 34 434 726'
const CURRENT = '0963812069'

function replaceDeep(value: unknown): unknown {
  if (typeof value === 'string') return value.replaceAll(OLD, CURRENT)
  if (Array.isArray(value)) return value.map(replaceDeep)
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, replaceDeep(item)]))
  }
  return value
}

async function main() {
  const payload = await getPayload({ config: await config })
  const footer = await payload.findGlobal({ slug: 'footer', locale: 'en', depth: 0 })
  const hotlines = footer.hotlines?.map((line) => ({
    ...line,
    phone: line.language?.toLowerCase().includes('burmese') ? CURRENT : line.phone,
  }))
  if (hotlines) await payload.updateGlobal({ slug: 'footer', locale: 'en', data: { hotlines } })

  for (const locale of ['en', 'th'] as const) {
    const { docs } = await payload.find({ collection: 'pages', locale, depth: 0, limit: 1, where: { slug: { equals: 'contact' } } })
    const contact = docs[0]
    if (!contact) throw new Error(`Missing ${locale} contact page`)
    const layout = replaceDeep(contact.layout) as typeof contact.layout
    await payload.update({ collection: 'pages', id: contact.id, locale, data: { layout } })
  }
  payload.logger.info('Updated Burmese hotline in footer and contact page: ' + CURRENT)
  process.exit(0)
}

void main()
