import type { Metadata } from 'next'
import { routing, type Locale } from '@/i18n/routing'
import { LOCALE_META } from '@/i18n/locales'
import { isReviewed } from '@/i18n/review'

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
  // hreflang only for locales a native speaker has signed off (src/i18n/review.ts).
  const reviewed = routing.locales.filter((l) => isReviewed(l))
  const languages = Object.fromEntries(reviewed.map((l) => [l, `/${l}${path}`]))

  // OG wants POSIX-style locales (th_TH), not route codes (th).
  const ogLocale = LOCALE_META[locale]?.og ?? 'en_US'
  const ogAlternate = reviewed.filter((l) => l !== locale).map((l) => LOCALE_META[l].og)
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
