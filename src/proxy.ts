import createMiddleware from 'next-intl/middleware'
import { NextResponse, type NextRequest } from 'next/server'
import { routing } from './i18n/routing'
import { legacyPostDestination } from './lib/legacy-posts'

// Next.js 16 renamed the `middleware` file convention to `proxy`.
const localeMiddleware = createMiddleware(routing)

export default function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname
  const match = path.match(/^\/(?:([a-z]{2})\/)?post\/(.+)$/)
  if (match) {
    const locale = match[1] === 'th' ? 'th' : 'en'
    let oldSlug = match[2]
    try {
      oldSlug = decodeURIComponent(oldSlug)
    } catch {
      // Leave malformed paths for the normal route to handle.
    }
    const destination = legacyPostDestination(oldSlug, locale)
    if (destination) return NextResponse.redirect(new URL(destination, request.url), 308)
  }
  return localeMiddleware(request)
}

// Run locale routing only on frontend paths. Exclude Payload's admin & API
// (/admin, /api), Next internals (_next), Payload internals (_payload), and any
// path containing a dot (static files, favicon, etc.).
export const config = {
  matcher: ['/((?!api|admin|_next|_payload|.*\\..*).*)'],
}
