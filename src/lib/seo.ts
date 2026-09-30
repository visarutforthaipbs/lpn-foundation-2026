import type { Metadata } from 'next'
import { routing, type Locale } from '@/i18n/routing'

function resolveSiteUrl(): URL {
  const candidates = [
    process.env.NEXT_PUBLIC_SERVER_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`,
    process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`,
    process.env.NODE_ENV === 'production' ? 'https://lpn-foundation-2026.vercel.app' : 'http://localhost:3000',
  ]
  for (const candidate of candidates) {
    if (!candidate) continue
    try {
      const url = new URL(candidate)
      if (url.protocol === 'https:' || url.hostname === 'localhost') return url
    } catch { /* Ignore invalid deployment placeholders. */ }
  }
  return new URL('http://localhost:3000')
}

export const SITE_URL_OBJ = resolveSiteUrl()
export const SITE_URL = SITE_URL_OBJ.origin

/**
 * Builds localized metadata with hreflang alternates.
 * @param path Locale-agnostic path, e.g. "" for home, "/about", "/post/foo".
 */
export function buildMetadata({
  locale,
  path,
  title,
  description,
  image,
}: {
  locale: Locale
  path: string
  title: string
  description?: string
  image?: string
}): Metadata {
  const languages = Object.fromEntries(routing.locales.map((l) => [l, `/${l}${path}`]))

  // OG wants POSIX-style locales (th_TH), not route codes (th).
  const ogLocale = locale === 'th' ? 'th_TH' : 'en_US'
  const ogAlternate = routing.locales
    .filter((l) => l !== locale)
    .map((l) => (l === 'th' ? 'th_TH' : 'en_US'))
  const shareImage = image ?? `${SITE_URL}/images/lpn-share.png`

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}${path}`,
      languages,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${locale}${path}`,
      siteName: 'LPN Foundation',
      locale: ogLocale,
      alternateLocale: ogAlternate,
      type: 'website',
      images: [{ url: shareImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [shareImage],
    },
  }
}
