import React from 'react'
import { notFound } from 'next/navigation'
import localFont from 'next/font/local'
import { IBM_Plex_Sans } from 'next/font/google'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { routing, type Locale } from '@/i18n/routing'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import '../styles.css'

import { SITE_URL_OBJ } from '@/lib/seo'

// Latin — clean geometric sans-serif that anchors the documentary, high-contrast look.
const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-latin',
  display: 'swap',
})

// Thai — Premium DB Helvethaica X local font with Regular, Medium, and Bold weights
const dbHelvethaicaX = localFont({
  src: [
    {
      path: '../../../../public/fonts/dbhelvethaicax-webfont.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../../../public/fonts/dbhelvethaicaxmed-webfont.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../../../public/fonts/dbhelvethaicaxbd-webfont.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-thai',
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
    <html lang={locale} className={`${ibmPlexSans.variable} ${dbHelvethaicaX.variable}`}>
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
