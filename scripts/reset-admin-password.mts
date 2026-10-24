// Reset a CMS user's password without email (the site has no email adapter, so "Forgot password" never arrives).
// Generates a random 20-char password, sets it through Payload (hashed by Payload), clears any login lockout,
// verifies it by logging in, and prints it ONCE to the terminal of whoever runs it. Never logged, never sent anywhere.
//
//   local DB : npx tsx scripts/reset-admin-password.mts admin@lpnfoundation.org
//   PRODUCTION: npx tsx scripts/reset-admin-password.mts admin@lpnfoundation.org --prod
//               (--prod reads DATABASE_URL from the saved prod env file instead of .env.local)
import { randomInt } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import { homedir } from 'node:os'

const args = process.argv.slice(2)
const email = (args.find((a) => !a.startsWith('--')) ?? '').trim().toLowerCase()
const prod = args.includes('--prod')
if (!email.includes('@')) {
  console.error('usage: npx tsx scripts/reset-admin-password.mts <email> [--prod]')
  process.exit(2)
}

// Load env BEFORE importing the Payload config (it reads process.env at import time).
const envFile = prod ? `${homedir()}/.hermes/profiles/lpn-website/audit/env.local-prod-backup-20261024` : '.env.local'
if (!existsSync(envFile)) {
  console.error(`env file not found: ${envFile}`)
  process.exit(2)
}
for (const line of [...(existsSync('.env') ? readFileSync('.env', 'utf8').split('\n') : []), ...readFileSync(envFile, 'utf8').split('\n')]) {
  const m = /^\s*#?\s*([A-Z_][A-Z0-9_]*)=(.*)$/.exec(line)
  if (!m) continue
  const commented = /^\s*#/.test(line)
  // prod backup file has the real DB lines uncommented; .env.local has prod lines commented out — skip comments there.
  if (commented) continue
  process.env[m[1]] = m[2].replace(/^"(.*)"$/, '$1')
}

// CRITICAL: Payload's postgres adapter runs a dev schema PUSH on init when NODE_ENV !== 'production' — against whatever
// DATABASE_URL is set. With --prod that silently altered the live schema (2026-10-24: added my/km/lo locale enum values).
// Force production mode so init never pushes; schema changes go through committed migrations only.
;(process.env as Record<string, string>).NODE_ENV = 'production'

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
const password = Array.from({ length: 20 }, () => ALPHABET[randomInt(ALPHABET.length)]).join('')

const { getPayload } = await import('payload')
const { default: config } = await import('../src/payload.config')
const payload = await getPayload({ config })

const { docs } = await payload.find({ collection: 'users', where: { email: { equals: email } }, limit: 1 })
if (!docs[0]) {
  console.error(`no CMS user with email ${email}`)
  process.exit(1)
}
await payload.update({
  collection: 'users',
  id: docs[0].id,
  data: { password, loginAttempts: 0, lockUntil: null } as never,
  overrideAccess: true,
})
await payload.login({ collection: 'users', data: { email, password } }) // throws if it didn't take

const host = (() => { try { return new URL(process.env.DATABASE_URL ?? '').hostname } catch { return '?' } })()
const where = `${prod ? 'PRODUCTION (live site)' : 'LOCAL dev database'} [db host ${host}]`
console.log(`password reset for ${email} on ${where} — login verified`)
console.log(`new password (shown once, save it in your password manager): ${password}`)
process.exit(0)
