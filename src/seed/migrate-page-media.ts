/** Import original images referenced by the public Wix pages into Payload media.
 *
 * First run `python3 src/seed/export-wix-pages.py`, then run this script with
 * production Payload/Blob environment variables. Safe to rerun.
 */
import './loadenv'
import { readFile } from 'node:fs/promises'
import { getPayload } from 'payload'
import config from '../payload.config'

type WixPage = { slug: string; mediaUrls: string[] }

const mediaId = (url: string) => {
  const id = url.split('/media/')[1]?.split(/[/?#]/)[0]
  return id && /^[a-z0-9]+_[a-z0-9_~-]+\.(?:jpe?g|png|gif)$/i.test(id) ? id : null
}

const normalize = (filename: string) =>
  filename
    .replace(/_mv(?=\d)/, '~mv')
    .replace(/-[A-Za-z0-9]{24,}(?=\.[^.]+$)/, '')
    .replace(/-\d+(?=\.[^.]+$)/, '')

async function main() {
  const dryRun = process.argv.includes('--dry-run')
  const limitArg = process.argv.find((arg) => arg.startsWith('--limit='))
  const limit = limitArg ? Number(limitArg.slice('--limit='.length)) : Infinity
  if (!(limit > 0)) throw new Error('--limit must be positive')
  const pages = [
    ...(JSON.parse(await readFile('src/seed/wix-pages.snapshot.json', 'utf8')) as WixPage[]),
    ...(JSON.parse(await readFile('src/seed/wix-pages.th.snapshot.json', 'utf8')) as WixPage[]),
  ]
  const sources = new Map<string, string>()
  for (const page of pages) {
    for (const url of page.mediaUrls) {
      const id = mediaId(url)
      if (id && !sources.has(id)) sources.set(id, page.slug)
    }
  }

  const payload = await getPayload({ config: await config })
  const existing = await payload.find({ collection: 'media', limit: 1000, depth: 0 })
  const have = new Set(existing.docs.map((doc) => normalize(doc.filename || '')))
  const pending = [...sources.entries()].filter(([id]) => !have.has(normalize(id))).slice(0, limit)
  payload.logger.info(`Wix page media: ${sources.size} unique, ${pending.length} missing`)
  let imported = 0
  let failed = 0
  for (const [id, pageSlug] of pending) {
    if (dryRun) {
      payload.logger.info(`Would import ${id} (${pageSlug})`)
      continue
    }
    try {
      const response = await fetch(`https://static.wixstatic.com/media/${id}`)
      if (!response.ok) throw new Error(`Wix returned ${response.status}`)
      const buffer = Buffer.from(await response.arrayBuffer())
      const ext = id.split('.').pop()?.toLowerCase() || 'jpg'
      const mimetype = ext === 'jpg' ? 'image/jpeg' : `image/${ext}`
      const filename = id.replace(/[^\w.]/g, '_')
      await payload.create({
        collection: 'media',
        data: { alt: `LPN Foundation ${pageSlug} page image` },
        file: { data: buffer, mimetype, name: filename, size: buffer.length },
      })
      have.add(normalize(id))
      imported++
      payload.logger.info(`Imported ${imported}/${pending.length}: ${id}`)
    } catch (error) {
      failed++
      payload.logger.error(`FAILED ${id}: ${(error as Error).message}`)
    }
  }
  payload.logger.info(`Done: ${imported} imported, ${failed} failed${dryRun ? ' (dry run)' : ''}`)
  process.exit(failed ? 1 : 0)
}

void main()
