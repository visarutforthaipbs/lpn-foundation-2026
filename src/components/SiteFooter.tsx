import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { getFooter } from '@/lib/api'

export async function SiteFooter({ locale }: { locale: Locale }) {
  const footer = await getFooter(locale)
  const isThai = locale === 'th'

  const navLinks = isThai
    ? [
        { label: 'เกี่ยวกับเรา', href: '/about' },
        { label: 'บริการ', href: '/services' },
        { label: 'โครงการ', href: '/projects' },
        { label: 'ทีม', href: '/team' },
        { label: 'ติดต่อ', href: '/contact' },
        { label: 'บริจาค', href: '/donate' },
      ]
    : [
        { label: 'About', href: '/about' },
        { label: 'Services', href: '/services' },
        { label: 'Projects', href: '/projects' },
        { label: 'Team', href: '/team' },
        { label: 'Contact', href: '/contact' },
        { label: 'Donate', href: '/donate' },
      ]

  return (
    <footer className="mt-20 bg-black text-white contain-footer">
      {/* Emergency hotline strip */}
      {footer?.hotlines?.length ? (
        <div className="border-y border-brand-yellow/40 bg-brand-yellow text-black">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <span className="inline-block h-1.5 w-1.5 animate-pulse bg-black" />
              <span className="text-[10px] font-black uppercase tracking-[0.25em]">
                {isThai ? 'สายด่วนช่วยเหลือ' : 'Emergency hotlines'}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
              {footer.hotlines.map((h) => (
                <a
                  key={h.id ?? h.phone}
                  href={`tel:${h.phone}`}
                  className="group flex items-center gap-2 transition-opacity hover:opacity-70"
                >
                  <span className="text-[10px] font-black uppercase tracking-widest text-black/65">
                    {h.language}
                  </span>
                  <span className="font-mono text-sm font-bold text-black border-b border-black/30 group-hover:border-black">
                    {h.phone}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {/* Main footer */}
      <div className="border-b border-white/10">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-[2fr_1fr_1fr]">
          {/* Brand */}
          <div className="relative pl-5">
            <span className="absolute top-0 left-0 h-full w-1 bg-brand-yellow" />
            <img
              src="/logos/lpn-logo-white.svg"
              alt="LPN Foundation"
              className="h-16 w-auto md:h-20"
            />
            <p className="mt-5 max-w-md text-sm leading-relaxed text-white/65">
              {isThai
                ? 'มูลนิธิเครือข่ายส่งเสริมคุณภาพชีวิตแรงงาน — ทำงานเพื่อยุติการค้ามนุษย์และแรงงานบังคับมากว่า 15 ปี'
                : 'Labour Rights Promotion Network Foundation — ending human trafficking and forced labour for over 15 years.'}
            </p>
            <Link
              href="/donate"
              className="mt-6 inline-flex items-center text-[11px] font-black uppercase tracking-[0.25em] text-white border-b-2 border-brand-yellow pb-0.5 transition-colors hover:border-white"
            >
              {isThai ? 'ร่วมสนับสนุนภารกิจ →' : 'Fund the mission →'}
            </Link>
          </div>

          {/* Sitemap */}
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-brand-yellow">
              {isThai ? 'ลิงก์ภายใน' : 'Sitemap'}
            </h3>
            <ul className="mt-5 grid gap-2.5 text-sm">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-white/70 transition-colors hover:text-brand-yellow"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-brand-yellow">
              {isThai ? 'ติดต่อ' : 'Connect'}
            </h3>
            <ul className="mt-5 grid gap-2.5 text-sm">
              <li>
                <a
                  href="mailto:info@lpnfoundation.org"
                  className="font-mono text-white/70 transition-colors hover:text-brand-yellow"
                >
                  info@lpnfoundation.org
                </a>
              </li>
              {footer?.socials?.map((s) => (
                <li key={s.id ?? s.url}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/70 transition-colors hover:text-brand-yellow"
                  >
                    {s.platform} →
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 md:flex-row md:items-center md:justify-between">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/45">
          © {new Date().getFullYear()}{' '}
          {isThai
            ? 'มูลนิธิเครือข่ายส่งเสริมคุณภาพชีวิตแรงงาน'
            : 'Labour Rights Promotion Network Foundation'}
        </span>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/45">
          {isThai ? 'สมุทรสาคร · ประเทศไทย' : 'Samut Sakhon · Thailand'}
        </span>
      </div>
    </footer>
  )
}
