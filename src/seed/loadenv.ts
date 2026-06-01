import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

// If a script runs directly, we should use the unpooled database URL to avoid PgBouncer errors
if (process.env.DATABASE_URL_UNPOOLED) {
  console.log('loadenv: overriding DATABASE_URL with DATABASE_URL_UNPOOLED for script stability.')
  process.env.DATABASE_URL = process.env.DATABASE_URL_UNPOOLED
}
