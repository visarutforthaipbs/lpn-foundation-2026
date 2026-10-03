import Image from 'next/image'
import { Phone, PhoneCall } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { getHeader, getFooter } from '@/lib/api'
import { HOTLINES, telHref } from '@/lib/content'
import { ButtonLink } from './ui'
import dynamic from 'next/dynamic'
import { MobileMenu } from './MobileMenu'

const LocaleSwitcher = dynamic(() => import('./LocaleSwitcher').then((mod) => mod.LocaleSwitcher), {
  loading: () => <span className="t-label text-white/75">...</span>,
})

export async function SiteHeader({ locale }: { locale: Locale }) {
  const [header, footer] = await Promise.all([getHeader(locale), getFooter(locale)])
  const isThai = locale === 'th'

  // Two equal journeys: a direct help path and a visible support action.
  const ALLOWED: { href: string; en: string; th: string }[] = [
    { href: '/get-help', en: 'Get Help', th: 'ขอความช่วยเหลือ' },
    { href: '/our-work', en: 'Our Work', th: 'งานของเรา' },
    { href: '/impact', en: 'Impact & Reports', th: 'ผลการทำงานและรายงาน' },
    { href: '/about', en: 'About', th: 'เกี่ยวกับเรา' },
    { href: '/blog', en: 'News', th: 'ข่าวสาร' },
  ]
  const cmsItems = header?.navItems ?? []
  const cmsReady = ALLOWED.every((item) => cmsItems.some((cms) => cms.href === item.href))
  const navItems = cmsReady
    ? cmsItems.filter((item) => ALLOWED.some((allowed) => allowed.href === item.href)).map((item) => ({ href: item.href, label: item.label }))
    : ALLOWED.map((item) => ({ href: item.href, label: isThai ? item.th : item.en }))

  const donate = {
    href: header?.donateHref || '/donate',
    label: header?.donateLabel || (isThai ? 'บริจาค' : 'Donate'),
  }

  // Locale-appropriate hotline: CMS footer first, canonical list as fallback.
  const cmsHotline =
    (isThai
      ? footer?.hotlines?.find((h) => /thai|ไทย/i.test(h.language ?? ''))
      : undefined) ?? footer?.hotlines?.[0]
  const primaryHotline = cmsHotline ? { phone: cmsHotline.phone } : { phone: HOTLINES[0].phone }

  return (
    <header className="sticky top-0 z-50 bg-black text-white">
      {/* Utility strip — emergency hotline + locale */}
      <div className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2">
          {primaryHotline ? (
            <a
              href={telHref(primaryHotline.phone)}
              className="group flex items-center gap-2 text-white/70 transition-colors hover:text-brand-yellow"
            >
              <PhoneCall className="h-3.5 w-3.5 text-brand-yellow shrink-0" aria-hidden="true" />
              <span className="t-label text-brand-yellow">{isThai ? 'สายด่วน' : 'Hotline'}</span>
              <span className="font-mono text-xs text-white/85 group-hover:text-brand-yellow">
                {primaryHotline.phone}
              </span>
            </a>
          ) : (
            <span className="t-label text-white/75">LPN Foundation</span>
          )}
          <LocaleSwitcher />
        </div>
      </div>

      {/* Main bar */}
      <div className="relative border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
          <Link href="/" className="group flex items-center py-1" aria-label="LPN Foundation">
            <Image
              src="/logos/LPN_logo.svg"
              alt="LPN Foundation"
              width={56}
              height={44}
              priority
              unoptimized
              className="h-10 sm:h-11 w-auto brightness-0 invert transition-transform duration-200 group-hover:scale-105"
            />
          </Link>

          <nav aria-label={isThai ? 'เมนูหลัก' : 'Main menu'} className="hidden items-center gap-5 xl:gap-7 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group relative py-1 text-[11px] font-black uppercase tracking-[0.2em] text-white/80 transition-colors hover:text-white"
              >
                <span>{item.label}</span>
                <span className="absolute -bottom-0.5 left-0 h-0.5 w-0 bg-brand-yellow transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/contact"
              aria-label={isThai ? 'ติดต่อเรา' : 'Contact'}
              className="tactile-icon-btn h-11 w-11 text-white/80 hover:text-white"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
            </Link>

            <ButtonLink href={donate.href} variant="primary" className="px-5">
              {donate.label}
            </ButtonLink>

            <MobileMenu items={navItems} donate={donate} isThai={isThai} />
          </div>
        </div>
      </div>
    </header>
  )
}
