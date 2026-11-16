import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'

// Editor "Preview" button (Posts → admin.preview). Only a logged-in staff user can switch on Next.js draft mode,
// which makes /{locale}/post/{slug} show the latest DRAFT instead of the published copy. Nothing is published.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')
  const locale = searchParams.get('locale') || 'th'
  if (!slug || !/^[a-z]{2}$/.test(locale)) return new Response('Bad preview link', { status: 400 })

  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: request.headers })
  if (!user) return new Response('Log in to /admin first, then use the Preview button.', { status: 401 })

  ;(await draftMode()).enable()
  redirect(`/${locale}/post/${encodeURIComponent(slug)}`)
}
