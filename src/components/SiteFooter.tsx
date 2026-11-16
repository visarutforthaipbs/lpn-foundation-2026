import { EnvelopeSimple, MapPin, Phone } from '@phosphor-icons/react/ssr'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { getFooter } from '@/lib/api'
import { HOTLINES, OFFICE, SOCIALS, telHref } from '@/lib/content'
import { tx, txCms } from '@/i18n/tx'

export async function SiteFooter({ locale }: { locale: Locale }) {
  const footer = await getFooter(locale)

  const navLinks = tx(locale, [
        { label: 'ขอความช่วยเหลือ', href: '/get-help' },
        { label: 'รู้สิทธิ ติดกระเป๋า', href: 'https://guide.lpnfoundation.org/' },
        { label: 'งานของเรา', href: '/our-work' },
        { label: 'ผลการทำงานและรายงาน', href: '/impact' },
        { label: 'เกี่ยวกับเรา', href: '/about' },
        { label: 'ข่าวสาร', href: '/blog' },
        { label: 'ติดต่อ', href: '/contact' },
        { label: 'บริจาค', href: '/donate' },
      ], [
        { label: 'Get Help', href: '/get-help' },
        { label: 'Rights Guide', href: 'https://guide.lpnfoundation.org/' },
        { label: 'Our Work', href: '/our-work' },
        { label: 'Impact & Reports', href: '/impact' },
        { label: 'About', href: '/about' },
        { label: 'News', href: '/blog' },
        { label: 'Contact', href: '/contact' },
        { label: 'Donate', href: '/donate' },
      ])

  const linkCls = 'inline-flex min-h-11 items-center text-white/70 transition-colors hover:text-brand-yellow'
  const hotlines = footer?.hotlines?.length
    ? footer.hotlines.map((h) => ({ key: h.id ?? h.phone, label: txCms(locale, h.language ?? ''), phone: h.phone }))
    : HOTLINES.map((h) => ({ key: h.code, label: h.langNative, phone: h.phone }))
  const socials = footer?.socials?.length
    ? footer.socials.map((s) => ({ key: s.id ?? s.url, platform: s.platform, url: s.url }))
    : SOCIALS.map((s) => ({ key: s.url, platform: s.platform, url: s.url }))

  return (
    <footer className="mt-20 bg-black text-white contain-footer">
      {/* Hotline strip — the one safety-critical block; kept, but on one compact row */}
      <div className="border-y border-black/10 bg-paper text-black on-light">
        <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3 md:flex-row md:items-center md:gap-6">
          <span className="t-label shrink-0">{tx(locale, 'สายด่วน LPN', 'LPN hotlines')}</span>
          <ul className="grid md:flex md:flex-wrap md:gap-x-6">
            {hotlines.map((h) => (
              <li key={h.key}>
                <a href={telHref(h.phone)} className="group flex min-h-11 items-center gap-2">
                  <Phone size={18} className="shrink-0 text-black/70" aria-hidden="true" />
                  <span className="flex-1 text-sm text-black/65 md:flex-none">{h.label}</span>
                  <span className="whitespace-nowrap border-b border-black/30 text-sm font-bold group-hover:border-black">{h.phone}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main: brand + sitemap on one row, contact on the next */}
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-10">
          <Link href="/" className="flex min-h-11 shrink-0 items-center text-base font-bold">
            LPN Foundation
          </Link>
          <nav aria-label={tx(locale, 'แผนผังเว็บไซต์', 'Sitemap')}>
            <ul className="grid grid-cols-2 gap-x-6 text-sm md:flex md:flex-wrap md:justify-end md:gap-x-5">
              {navLinks.map((l) => (
                <li key={l.href}>
                  {l.href.startsWith('https://') ? (
                    <a href={l.href} className={linkCls}>{l.label}</a>
                  ) : (
                    <Link href={l.href} className={linkCls}>{l.label}</Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-6 flex flex-col gap-x-6 border-t border-white/10 pt-4 text-sm md:flex-row md:flex-wrap md:items-center">
          <address className="flex min-h-11 items-center gap-2 not-italic text-white/70">
            <MapPin size={18} className="shrink-0 text-brand-yellow" aria-hidden="true" />
            <span>{tx(locale, OFFICE.addressTh, OFFICE.addressEn)}</span>
          </address>
          {OFFICE.emails.map((e) => (
            <a key={e} href={`mailto:${e}`} className={`${linkCls} gap-2 font-mono`}>
              <EnvelopeSimple size={18} className="shrink-0 text-brand-yellow" aria-hidden="true" />
              <span>{e}</span>
            </a>
          ))}
          <div className="flex flex-wrap gap-x-5">
            {socials.map((s) => (
              <a key={s.key} href={s.url} target="_blank" rel="noopener noreferrer" className={linkCls}>
                {s.platform} →
              </a>
            ))}
          </div>
        </div>

        <p className="mt-4 text-xs text-white/60">
          © {new Date().getFullYear()} {tx(locale, OFFICE.nameTh, OFFICE.nameEn)} · {tx(locale, 'ปทุมธานี ประเทศไทย', 'Pathum Thani, Thailand')}
        </p>
      </div>
    </footer>
  )
}
