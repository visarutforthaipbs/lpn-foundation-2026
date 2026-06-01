import './loadenv'
import { getPayload } from 'payload'
import config from '../payload.config'
import fs from 'fs'
import path from 'path'

const PROGRESS_FILE = path.resolve(process.cwd(), 'src/seed/progress.json')

// Helper function to sleep
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Read progress file
function getProgress(): number[] {
  try {
    if (fs.existsSync(PROGRESS_FILE)) {
      const content = fs.readFileSync(PROGRESS_FILE, 'utf-8')
      return JSON.parse(content)
    }
  } catch (e) {
    console.error('Error reading progress file, starting fresh:', (e as Error).message)
  }
  return []
}

// Save progress file
function saveProgress(id: number) {
  try {
    const list = getProgress()
    if (!list.includes(id)) {
      list.push(id)
      fs.writeFileSync(PROGRESS_FILE, JSON.stringify(list, null, 2), 'utf-8')
    }
  } catch (e) {
    console.error('Error writing progress file:', (e as Error).message)
  }
}

async function fetchWixImage(filename: string): Promise<{ buf: Buffer; mimetype: string } | undefined> {
  const ext = filename.split('.').pop()?.toLowerCase() || 'jpg'
  const withoutExt = filename.slice(0, filename.lastIndexOf('.'))
  
  // 1. Wix ID with collision suffix removed (e.g., -3) and _mv2 converted back to ~mv2
  const baseName = withoutExt.replace(/-\d+$/, '')
  const standardWixId = baseName.replace(/_mv(\d+)$/, '~mv$1') + '.' + ext

  // 2. Wix ID with just collision suffix removed (e.g., in case it didn't have ~)
  const cleanFilename = baseName + '.' + ext

  const urls = [
    `https://static.wixstatic.com/media/${standardWixId}`,
    `https://static.wixstatic.com/media/${cleanFilename}`,
    `https://static.wixstatic.com/media/${filename}`,
  ]

  // Deduplicate URLs
  const uniqueUrls = Array.from(new Set(urls))

  for (const url of uniqueUrls) {
    try {
      const res = await fetch(url)
      if (res.ok) {
        const buf = Buffer.from(await res.arrayBuffer())
        const mimetype = `image/${ext === 'png' ? 'png' : ext === 'gif' ? 'gif' : 'jpeg'}`
        return { buf, mimetype }
      }
    } catch (e) {
      // silent fail to try next URL
    }
  }
  return undefined
}

async function main() {
  console.log('Connecting to database:', process.env.DATABASE_URL)
  console.log('BLOB_READ_WRITE_TOKEN exists:', !!process.env.BLOB_READ_WRITE_TOKEN)

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error('Error: BLOB_READ_WRITE_TOKEN is missing in environment variables. Cannot upload to Vercel Blob!')
    process.exit(1)
  }

  const payload = await getPayload({ config: await config })
  
  console.log('Fetching all media records from database...')
  const mediaResult = await payload.find({
    collection: 'media',
    limit: 1000, // retrieve all records
  })

  console.log(`Total media documents in database: ${mediaResult.totalDocs}`)

  const mediaToRepair = mediaResult.docs
  const progressList = getProgress()
  console.log(`Loaded progress: ${progressList.length} items already repaired.`)

  let repairedCount = 0
  let failedCount = 0
  let skippedCount = 0

  // Run sequentially (concurrency = 1) for absolute connection stability over Neon unpooled host
  for (let i = 0; i < mediaToRepair.length; i++) {
    const doc = mediaToRepair[i]
    const index = i + 1

    if (progressList.includes(doc.id)) {
      console.log(`[${index}/${mediaToRepair.length}] Skipping already repaired: ID=${doc.id}, Filename=${doc.filename}`)
      skippedCount++
      continue
    }

    console.log(`[${index}/${mediaToRepair.length}] Repairing: ID=${doc.id}, Filename=${doc.filename}`)

    // 1. Fetch the image from Wix static CDN
    const fileData = await fetchWixImage(doc.filename)
    if (!fileData) {
      console.error(`  ❌ [${index}/${mediaToRepair.length}] Failed to retrieve image from Wix: ${doc.filename}`)
      failedCount++
      continue
    }

    // 2. Update with retries (up to 3 attempts with exponential backoff)
    let attempt = 0
    let success = false
    const maxAttempts = 3

    while (attempt < maxAttempts && !success) {
      attempt++
      try {
        if (attempt > 1) {
          console.log(`  Retry attempt ${attempt}/${maxAttempts} for ${doc.filename}...`)
          await sleep(1500 * attempt) // Backoff sleep
        }

        await payload.update({
          collection: 'media',
          id: doc.id,
          data: {}, 
          file: {
            data: fileData.buf,
            mimetype: fileData.mimetype,
            name: doc.filename,
            size: fileData.buf.length,
          },
        })

        console.log(`  ✅ [${index}/${mediaToRepair.length}] Repaired successfully! ID=${doc.id}`)
        saveProgress(doc.id)
        repairedCount++
        success = true
      } catch (e) {
        console.error(`  ⚠️ [${index}/${mediaToRepair.length}] Attempt ${attempt} failed:`, (e as Error).message)
        if (attempt === maxAttempts) {
          failedCount++
        }
      }
    }

    // Delay 400ms between sequential uploads to keep Neon connection perfectly stable
    await sleep(400)
  }

  console.log(`\n========================================`)
  console.log(`Media Repair complete!`)
  console.log(`- Total processed: ${mediaToRepair.length}`)
  console.log(`- Already repaired (skipped): ${skippedCount}`)
  console.log(`- Repaired in this run: ${repairedCount}`)
  console.log(`- Failed: ${failedCount}`)
  console.log(`========================================`)

  process.exit(0)
}

main().catch(console.error)
