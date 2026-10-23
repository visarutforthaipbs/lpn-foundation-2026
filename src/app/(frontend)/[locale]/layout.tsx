import React from 'react'
import { notFound } from 'next/navigation'
import localFont from 'next/font/local'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { routing, type Locale } from '@/i18n/routing'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { MotionProvider } from '@/components/motion'
import '../styles.css'

import { SITE_URL_OBJ } from '@/lib/seo'
import { isReviewed } from '@/i18n/review'
import { tx } from '@/i18n/tx'

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

// Migrant-language scripts — Noto Sans Myanmar / Khmer / Lao (SIL OFL, public/fonts/OFL-Noto.txt),
// variable wght files covering 400–700, script subsets only. Not preloaded: the font stacks in
// styles.css reference them only under html:lang(my|km|lo), so en/th pages never download them.
const notoMyanmar = localFont({
  src: [{ path: '../../../../public/fonts/NotoSansMyanmar-var-myanmar.woff2', weight: '400 700', style: 'normal' }],
  variable: '--font-myanmar',
  display: 'swap',
  preload: false,
})
const notoKhmer = localFont({
  src: [{ path: '../../../../public/fonts/NotoSansKhmer-var-khmer.woff2', weight: '400 700', style: 'normal' }],
  variable: '--font-khmer',
  display: 'swap',
  preload: false,
})
const notoLao = localFont({
  src: [{ path: '../../../../public/fonts/NotoSansLao-var-lao.woff2', weight: '400 700', style: 'normal' }],
  variable: '--font-lao',
  display: 'swap',
  preload: false,
})

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  return {
    metadataBase: SITE_URL_OBJ,
    title: {
      default: 'LPN Foundation',
      template: '%s · LPN Foundation',
    },
    description: tx(
      locale,
      'LPN works alongside migrant workers and families in Thailand to access protection today and build safer systems for tomorrow.',
      'LPN works alongside migrant workers and families in Thailand to access protection today and build safer systems for tomorrow.',
    ),
    // Machine-draft locales stay out of search until a native speaker signs them off (src/i18n/review.ts).
    ...(isReviewed(locale) ? {} : { robots: { index: false, follow: true } }),
  }
}

const DRAFT_NOTICE_EN = 'This translation is a draft and has not yet been checked by a native speaker.'

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
    <html
      lang={locale}
      className={`${ibmPlexSans.variable} ${ibmPlexSansThai.variable} ${ibmPlexSansThaiLooped.variable} ${notoMyanmar.variable} ${notoKhmer.variable} ${notoLao.variable}`}
    >
      <body>
        <a href="#main" className="skip-link">
          {tx(locale, 'ข้ามไปยังเนื้อหา', 'Skip to content')}
        </a>
        <NextIntlClientProvider messages={messages}>
          <div className="flex min-h-screen flex-col">
            <SiteHeader locale={locale as Locale} />
            {!isReviewed(locale) && (
              <div role="note" className="draft-notice border-b border-black/15 bg-paper text-black on-light">
                {/* pr-40: room for the fixed Quick Exit pill on /get-help so it never covers the notice. */}
                <p className="mx-auto max-w-7xl py-2 pr-40 pl-4 text-sm">
                  <span>{tx(locale, DRAFT_NOTICE_EN, DRAFT_NOTICE_EN)}</span>
                  <span lang="en" className="block text-black/70">{DRAFT_NOTICE_EN}</span>
                </p>
              </div>
            )}
            <main id="main" className="flex-1">
              <MotionProvider>{children}</MotionProvider>
            </main>
            <SiteFooter locale={locale as Locale} />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
