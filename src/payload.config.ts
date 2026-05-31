import { postgresAdapter } from '@payloadcms/db-postgres'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Authors } from './collections/Authors'
import { Categories } from './collections/Categories'
import { Posts } from './collections/Posts'
import { TeamMembers } from './collections/TeamMembers'
import { Pages } from './collections/Pages'
import { Header } from './globals/Header'
import { Footer } from './globals/Footer'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const blobToken = process.env.BLOB_READ_WRITE_TOKEN

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Pages, Posts, Categories, Authors, TeamMembers, Media, Users],
  globals: [Header, Footer],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  // Thai/English content localization. Untranslated fields fall back to English
  // so the site never renders blank in either locale.
  localization: {
    locales: [
      { label: 'English', code: 'en' },
      { label: 'ไทย', code: 'th' },
    ],
    defaultLocale: 'en',
    fallback: true,
  },
  db: postgresAdapter({
    pool: {
      // Use the Neon *pooled* connection string in production (host ends in
      // `-pooler`) — serverless functions exhaust unpooled connections.
      connectionString: process.env.DATABASE_URL || '',
      // Keep-alive + generous timeouts so Neon's cold-start and idle behaviour
      // don't drop the socket mid-operation (ETIMEDOUT).
      keepAlive: true,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 30000,
    },
  }),
  sharp,
  plugins: [
    // Uploads go to Vercel Blob wherever the token is set. Without a token
    // (e.g. fresh local dev) Payload falls back to local disk.
    vercelBlobStorage({
      enabled: Boolean(blobToken),
      collections: { media: true },
      token: blobToken || '',
    }),
  ],
})
