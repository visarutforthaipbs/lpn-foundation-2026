import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

// Next.js 16 renamed the `middleware` file convention to `proxy`.
export default createMiddleware(routing)

// Run locale routing only on frontend paths. Exclude Payload's admin & API
// (/admin, /api), Next internals (_next), Payload internals (_payload), and any
// path containing a dot (static files, favicon, etc.).
export const config = {
  matcher: ['/((?!api|admin|_next|_payload|.*\\..*).*)'],
}
