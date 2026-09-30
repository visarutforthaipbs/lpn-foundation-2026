import type { Metadata } from 'next'
import { routing, type Locale } from '@/i18n/routing'

export const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

/**
 * Parsed origin for metadataBase. Falls back to localhost when the env value is
 * missing or malformed so an env mistake degrades to wrong-but-working metadata
 * instead of crashing the build with ERR_INVALID_URL.
 */
function parseSiteUrl(): URL {
  try {
    return new URL(SITE_URL)
  } catch {
    console.warn(`[seo] NEXT_PUBLIC_SERVER_URL is not a valid URL (${JSON.stringify(SITE_URL)}); falling back to http://localhost:3000`)
    return new URL('http://localhost:3000')
  }
}

export const SITE_URL_OBJ = parseSiteUrl()

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
  // Full-bleed documentary hero as the default share card (LINE/FB dominate TH
  // traffic — always ship a large image). TODO: dedicated 1200x630 brand banner.
  const shareImage = image ?? `${SITE_URL}/images/trawler-hero.jpg`

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
