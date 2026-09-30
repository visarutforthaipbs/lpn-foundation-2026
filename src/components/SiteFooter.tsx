import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { getFooter } from '@/lib/api'
import { HOTLINES, OFFICE, SOCIALS, FACEBOOK_URL, telHref } from '@/lib/content'

export async function SiteFooter({ locale }: { locale: Locale }) {
  const footer = await getFooter(locale)
  const isThai = locale === 'th'

  const navLinks = isThai
    ? [
        { label: 'ขอความช่วยเหลือ', href: '/get-help' },
        { label: 'รู้สิทธิ ติดกระเป๋า', href: 'https://www.lpnrightguide.site/' },
        { label: 'งานของเรา', href: '/our-work' },
        { label: 'ผลการทำงานและรายงาน', href: '/impact' },
        { label: 'เกี่ยวกับเรา', href: '/about' },
        { label: 'ข่าวสาร', href: '/blog' },
        { label: 'ติดต่อ', href: '/contact' },
        { label: 'บริจาค', href: '/donate' },
      ]
    : [
        { label: 'Get Help', href: '/get-help' },
        { label: 'Rights Guide', href: 'https://www.lpnrightguide.site/' },
        { label: 'Our Work', href: '/our-work' },
        { label: 'Impact & Reports', href: '/impact' },
        { label: 'About', href: '/about' },
        { label: 'News', href: '/blog' },
        { label: 'Contact', href: '/contact' },
        { label: 'Donate', href: '/donate' },
      ]

  return (
    <footer className="mt-20 bg-black text-white contain-footer">
      {/* Emergency hotline strip — the site's most safety-critical content */}
      <div className="border-y border-black/10 bg-brand-yellow text-black">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 md:flex-row md:items-start md:justify-between">
          <div className="max-w-md">
            <div className="flex items-center gap-3">
              <span className="inline-block h-1.5 w-1.5 animate-pulse bg-black" aria-hidden="true" />
              <span className="t-label">{isThai ? 'หากท่านต้องการความช่วยเหลือ' : 'Get help now'}</span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-black/75">
              {isThai
                ? 'แจ้งปัญหา ขอความช่วยเหลือ หรือสอบถามข้อมูลกฎหมายแรงงานและการลงทะเบียน โปรดติดต่อ LPN โดยตรงตามหมายเลขภาษาที่ต้องการ'
                : 'To report a case, request assistance, get information on labor laws or government registration process, get in touch directly. We speak Thai, Khmer, Lao & Burmese.'}
            </p>
            <a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="link-mark mt-3 text-black"
            >
              {isThai ? 'ติดต่อเราได้ที่ Facebook' : 'Message us on Facebook'}
            </a>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            {(footer?.hotlines?.length
              ? footer.hotlines.map((h) => ({
                  key: h.id ?? h.phone,
                  label: h.language ?? '',
                  phone: h.phone,
                }))
              : HOTLINES.map((h) => ({ key: h.code, label: h.langNative, phone: h.phone }))
            ).map((h) => (
              <a
                key={h.key}
                href={telHref(h.phone)}
                className="group flex min-h-11 items-center gap-2 transition-opacity hover:opacity-70"
              >
                <span className="t-label text-black/65">{h.label}</span>
                <span className="border-b border-black/30 font-mono text-sm font-bold text-black group-hover:border-black">
                  {h.phone}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="border-b border-white/10">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-[2fr_1fr_1fr]">
          {/* Brand */}
          <div className="relative pl-5">
            <span className="absolute top-0 left-0 h-full w-1 bg-brand-yellow" aria-hidden="true" />
            <img
              src="/logos/lpn-logo-white.svg"
              alt="LPN Foundation"
              className="h-16 w-auto md:h-20"
            />
            <p className="mt-5 max-w-md text-sm leading-relaxed text-white/65">
              {isThai
                ? 'มูลนิธิเครือข่ายส่งเสริมคุณภาพชีวิตแรงงาน — เคียงข้างแรงงานข้ามชาติและครอบครัว เพื่อการช่วยเหลือในวันนี้และระบบที่ปลอดภัยขึ้นในระยะยาว'
                : 'Labour Rights Promotion Network Foundation — helping migrant workers and families access protection today and build safer systems for tomorrow.'}
            </p>
            <Link
              href="/donate"
              className="link-mark mt-6 text-white hover:text-brand-yellow"
            >
              {isThai ? 'ร่วมสนับสนุนภารกิจ' : 'Fund the mission'} →
            </Link>
          </div>

          {/* Sitemap */}
          <nav aria-label={isThai ? 'แผนผังเว็บไซต์' : 'Sitemap'}>
            <h3 className="t-label text-brand-yellow">{isThai ? 'ลิงก์ภายใน' : 'Sitemap'}</h3>
            <ul className="mt-5 grid gap-2.5 text-sm">
              {navLinks.map((l) => (
                <li key={l.href}>
                  {l.href.startsWith('https://') ? (
                    <a href={l.href} className="inline-flex min-h-11 items-center text-white/70 transition-colors hover:text-brand-yellow">{l.label}</a>
                  ) : (
                    <Link href={l.href} className="inline-flex min-h-11 items-center text-white/70 transition-colors hover:text-brand-yellow">{l.label}</Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Connect */}
          <div>
            <h3 className="t-label text-brand-yellow">
              {isThai ? 'สำนักงานใหญ่ประเทศไทย' : 'Thailand Headquarters'}
            </h3>
            <address className="mt-5 text-sm leading-relaxed text-white/70 not-italic">
              {isThai ? OFFICE.addressTh : OFFICE.addressEn}
            </address>
            <p className="mt-3 font-mono text-sm text-white/85">
              {isThai ? OFFICE.phoneTh : OFFICE.phoneEn}
            </p>
            <ul className="mt-3 grid gap-2.5 text-sm">
              {OFFICE.emails.map((e) => (
                <li key={e}>
                  <a
                    href={`mailto:${e}`}
                    className="inline-flex min-h-11 items-center font-mono text-white/70 transition-colors hover:text-brand-yellow"
                  >
                    {e}
                  </a>
                </li>
              ))}
              {(footer?.socials?.length
                ? footer.socials.map((s) => ({ key: s.id ?? s.url, platform: s.platform, url: s.url }))
                : SOCIALS.map((s) => ({ key: s.url, platform: s.platform, url: s.url }))
              ).map((s) => (
                <li key={s.key}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center text-white/70 transition-colors hover:text-brand-yellow"
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
        <span className="t-label text-white/70">
          © {new Date().getFullYear()}{' '}
          {isThai ? OFFICE.nameTh : OFFICE.nameEn}
        </span>
        <span className="t-label text-white/70">
          {isThai ? 'ปทุมธานี · ประเทศไทย' : 'Pathum Thani · Thailand'}
        </span>
      </div>
    </footer>
  )
}
