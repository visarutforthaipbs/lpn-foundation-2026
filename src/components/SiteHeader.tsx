import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { getHeader, getFooter } from '@/lib/api'
import { LocaleSwitcher } from './LocaleSwitcher'

export async function SiteHeader({ locale }: { locale: Locale }) {
  const [header, footer] = await Promise.all([getHeader(locale), getFooter(locale)])

  // Only show these four items, in this order.
  const ALLOWED: { href: string; en: string; th: string }[] = [
    { href: '/about', en: 'About', th: 'เกี่ยวกับเรา' },
    { href: '/team', en: 'Team', th: 'ทีมงาน' },
    { href: '/services', en: 'Services', th: 'บริการ' },
    { href: '/blog', en: 'Blog', th: 'บล็อก' },
  ]
  const cmsItems = header?.navItems ?? []
  const navItems = ALLOWED.map((allowed) => {
    const cms = cmsItems.find((n) => n.href === allowed.href)
    return { href: allowed.href, label: cms?.label ?? (locale === 'th' ? allowed.th : allowed.en) }
  })
  const isThai = locale === 'th'

  // Pick the locale-appropriate hotline from CMS, falling back to the Thai line.
  const primaryHotline =
    footer?.hotlines?.find((h) => (isThai ? /thai|ไทย/i.test(h.language ?? '') : true)) ??
    footer?.hotlines?.[0]

  return (
    <header className="sticky top-0 z-50 bg-black text-white">
      {/* Top utility strip — emergency hotline + locale */}
      <div className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em]">
          {primaryHotline ? (
            <a
              href={`tel:${primaryHotline.phone}`}
              className="group flex items-center gap-2 text-white/70 transition-colors hover:text-brand-yellow"
            >
              <span className="inline-block h-1.5 w-1.5 animate-pulse bg-brand-yellow" />
              <span className="text-brand-yellow">{isThai ? 'สายด่วน' : 'Hotline'}</span>
              <span className="font-mono normal-case tracking-normal text-white/85 group-hover:text-brand-yellow">
                {primaryHotline.phone}
              </span>
            </a>
          ) : (
            <span className="text-white/55">{isThai ? 'มูลนิธิ LPN' : 'LPN Foundation'}</span>
          )}
          <LocaleSwitcher />
        </div>
      </div>

      {/* Main bar */}
      <div className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
          <Link href="/" className="group flex items-center gap-3">
            <img
              src="/logos/lpn-logo-white.svg"
              alt="LPN Foundation"
              className="h-7 w-auto transition-transform group-hover:scale-[1.02]"
            />
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group relative text-[11px] font-black uppercase tracking-[0.2em] text-white/80 transition-colors hover:text-white"
              >
                <span>{item.label}</span>
                <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-brand-yellow transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/contact"
              aria-label={isThai ? 'ติดต่อเรา' : 'Contact'}
              className="flex h-9 w-9 items-center justify-center rounded border border-white/20 text-white/70 transition-all hover:border-white/60 hover:text-white"
            >
              {/* Phone icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.06 6.06l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </Link>

            <Link
              href={header?.donateHref || '/donate'}
              className="rounded bg-brand-yellow px-5 py-2.5 text-[11px] font-black uppercase tracking-[0.2em] text-black transition-all hover:bg-white border border-transparent hover:border-black"
            >
              {header?.donateLabel || (isThai ? 'บริจาค' : 'Donate')}
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
