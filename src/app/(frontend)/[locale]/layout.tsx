import React from 'react'
import { notFound } from 'next/navigation'
import localFont from 'next/font/local'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { routing, type Locale } from '@/i18n/routing'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import '../styles.css'

import { SITE_URL_OBJ } from '@/lib/seo'

// LPN One CI typography (brand/BRAND.md rule 5): the IBM Plex superfamily, SIL OFL,
// self-hosted from public/fonts (licence: public/fonts/OFL.txt). No Google Fonts
// request at build or runtime; DB Helvethaica X is retired (LPN holds no licence).
// Latin — IBM Plex Sans (latin subset).
const ibmPlexSans = localFont({
  src: [
    { path: '../../../../public/fonts/IBMPlexSans-400-latin.woff2', weight: '400', style: 'normal' },
    { path: '../../../../public/fonts/IBMPlexSans-500-latin.woff2', weight: '500', style: 'normal' },
    { path: '../../../../public/fonts/IBMPlexSans-600-latin.woff2', weight: '600', style: 'normal' },
    { path: '../../../../public/fonts/IBMPlexSans-700-latin.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-latin',
  display: 'swap',
})

// Thai UI — IBM Plex Sans Thai (loopless). Sits on the normal type scale.
const ibmPlexSansThai = localFont({
  src: [
    { path: '../../../../public/fonts/IBMPlexSansThai-400-thai.woff2', weight: '400', style: 'normal' },
    { path: '../../../../public/fonts/IBMPlexSansThai-500-thai.woff2', weight: '500', style: 'normal' },
    { path: '../../../../public/fonts/IBMPlexSansThai-600-thai.woff2', weight: '600', style: 'normal' },
    { path: '../../../../public/fonts/IBMPlexSansThai-700-thai.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-thai',
  display: 'swap',
})

// Thai long-form reading (rich-text bodies) — IBM Plex Sans Thai Looped.
const ibmPlexSansThaiLooped = localFont({
  src: [
    { path: '../../../../public/fonts/IBMPlexSansThaiLooped-400-thai.woff2', weight: '400', style: 'normal' },
    { path: '../../../../public/fonts/IBMPlexSansThaiLooped-600-thai.woff2', weight: '600', style: 'normal' },
    { path: '../../../../public/fonts/IBMPlexSansThaiLooped-700-thai.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-thai-reading',
  display: 'swap',
})

export const metadata = {
  metadataBase: SITE_URL_OBJ,
  title: {
    default: 'LPN Foundation',
    template: '%s · LPN Foundation',
  },
  description:
    'LPN works alongside migrant workers and families in Thailand to access protection today and build safer systems for tomorrow.',
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout(props: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { children } = props
  const { locale } = await props.params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  // Enables static rendering for this locale.
  setRequestLocale(locale)

  const messages = await getMessages()

  return (
    <html lang={locale} className={`${ibmPlexSans.variable} ${ibmPlexSansThai.variable} ${ibmPlexSansThaiLooped.variable}`}>
      <body>
        <a href="#main" className="skip-link">
          {locale === 'th' ? 'ข้ามไปยังเนื้อหา' : 'Skip to content'}
        </a>
        <NextIntlClientProvider messages={messages}>
          <div className="flex min-h-screen flex-col">
            <SiteHeader locale={locale as Locale} />
            <main id="main" className="flex-1">
              {children}
            </main>
            <SiteFooter locale={locale as Locale} />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
