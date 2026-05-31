import type { Metadata } from 'next'
import { routing, type Locale } from '@/i18n/routing'

export const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

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
      locale,
      type: 'website',
      images: image ? [{ url: image }] : undefined,
    },
  }
}
