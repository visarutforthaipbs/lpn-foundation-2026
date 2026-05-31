import { setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { routing } from '@/i18n/routing'
import { getPage } from '@/lib/api'
import { buildMetadata } from '@/lib/seo'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata(props: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await props.params
  const page = await getPage('contact', locale)
  return buildMetadata({
    locale,
    path: '/contact',
    title: page?.meta?.title || 'Contact LPN',
    description:
      page?.meta?.description ||
      'Reach LPN Foundation and our multilingual hotlines for migrant workers in Thailand.',
  })
}

const HOTLINES = [
  { code: 'TH', lang: 'ภาษาไทย (Thai)', phone: '+66 84 121 1609' },
  { code: 'MM', lang: 'မြန်မာဘာသာ (Burmese)', phone: '+66 34 434 726' },
  { code: 'KH', lang: 'ភាសាខ្មែរ (Khmer)', phone: '+66 85 534 1595' },
  { code: 'LA', lang: 'ພາສາລາວ (Lao)', phone: '+66 92 321 1516' },
]

export default async function ContactPage(props: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await props.params
  setRequestLocale(locale)
  const isThai = locale === 'th'

  const stats = isThai
    ? [
        { value: '24/7', label: 'สายด่วนรับเรื่อง' },
        { value: '4', label: 'ภาษาที่ให้บริการ' },
        { value: '100%', label: 'รักษาความลับ' },
      ]
    : [
        { value: '24/7', label: 'hotline coverage' },
        { value: '4', label: 'languages supported' },
        { value: '100%', label: 'confidential' },
      ]

  const office = isThai
    ? {
        name: 'มูลนิธิเครือข่ายส่งเสริมคุณภาพชีวิตแรงงาน',
        address: 'จังหวัดสมุทรสาคร ประเทศไทย',
        email: 'info@lpnfoundation.org',
        hours: 'จันทร์–ศุกร์ 09:00–17:00 น.',
      }
    : {
        name: 'Labour Rights Promotion Network Foundation',
        address: 'Samut Sakhon, Thailand',
        email: 'info@lpnfoundation.org',
        hours: 'Mon–Fri, 09:00–17:00 ICT',
      }

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-white/10 bg-black text-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{ backgroundImage: 'url(/images/trawler-hero.jpg)' }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/70 to-black/30" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 md:py-32">
          <div className="max-w-3xl">
            <span className="inline-flex rounded glass-tag px-3 py-1 text-[10px] font-black uppercase tracking-[0.25em] text-brand-yellow">
              {isThai ? 'ติดต่อ LPN' : 'Contact LPN'}
            </span>
            <h1 className="mt-6 text-4xl font-black leading-[1.05] tracking-tight text-balance md:text-6xl">
              {isThai
                ? 'หากคุณตกอยู่ในอันตราย — โทรหาเรา ตอนนี้'
                : 'If you are in danger — call us. Right now.'}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/85 md:text-lg">
              {isThai
                ? 'สายด่วนของเราเปิดรับการแจ้งเหตุและคำขอความช่วยเหลือเป็นความลับ ในหลายภาษา ตลอด 24 ชั่วโมง'
                : 'Our hotlines take reports and assistance requests confidentially, in four languages, around the clock.'}
            </p>
          </div>

          <dl className="mt-12 grid max-w-2xl grid-cols-3 gap-4 border-l-4 border-brand-yellow pl-6">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="text-[10px] font-bold uppercase tracking-widest text-white/55">
                  {s.label}
                </dt>
                <dd className="mt-1 text-2xl font-black md:text-3xl">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* HOTLINE CARDS */}
      <section className="border-b border-black bg-brand-yellow py-20 text-black md:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-12 max-w-2xl">
            <span className="inline-block rounded bg-black px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-brand-yellow">
              {isThai ? 'การช่วยเหลือฉุกเฉิน' : 'Emergency action'}
            </span>
            <h2 className="mt-4 text-3xl font-black uppercase tracking-tight md:text-5xl">
              {isThai ? 'สายด่วนหลายภาษา' : 'Multilingual hotlines'}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-black/80">
              {isThai
                ? 'พูดในภาษาของคุณ ปลอดภัย เป็นความลับ และเชื่อมต่อกับทีมภาคสนามทันที'
                : 'Speak in your language. Safe, confidential, and connected to our field team in real time.'}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {HOTLINES.map((h) => (
              <a
                key={h.code}
                href={`tel:${h.phone.replace(/\s+/g, '')}`}
                className="group relative flex flex-col overflow-hidden rounded border border-black bg-white p-6 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-black bg-brand-yellow text-xs font-black text-black">
                    {h.code}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-black/45">
                    {isThai ? 'โทรเลย' : 'Tap to call'}
                  </span>
                </div>
                <div className="mt-6 text-xs font-bold text-black/65">{h.lang}</div>
                <div className="mt-2 text-xl font-black tracking-tight text-black border-b-2 border-brand-yellow pb-1 group-hover:border-black transition-colors">
                  {h.phone}
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* OFFICE & EMAIL */}
      <section className="border-b border-white/10 bg-black py-20 text-white md:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-10 md:grid-cols-2">
            <article className="relative overflow-hidden glass-dark rounded p-8">
              <span className="absolute top-0 left-0 h-1.5 w-12 bg-brand-yellow" />
              <div className="text-[10px] font-bold uppercase tracking-widest text-brand-yellow">
                {isThai ? 'สำนักงาน' : 'Office'}
              </div>
              <h3 className="mt-3 text-2xl font-black uppercase tracking-tight">{office.name}</h3>
              <p className="mt-4 text-sm leading-relaxed text-white/75">{office.address}</p>
              <dl className="mt-6 grid gap-3 text-sm text-white/85">
                <div>
                  <dt className="text-[10px] font-bold uppercase tracking-widest text-white/55">
                    {isThai ? 'เวลาทำการ' : 'Office hours'}
                  </dt>
                  <dd className="mt-1">{office.hours}</dd>
                </div>
              </dl>
            </article>

            <article className="relative overflow-hidden glass-dark rounded p-8">
              <span className="absolute top-0 left-0 h-1.5 w-12 bg-brand-yellow" />
              <div className="text-[10px] font-bold uppercase tracking-widest text-brand-yellow">
                {isThai ? 'อีเมล' : 'Email'}
              </div>
              <h3 className="mt-3 text-2xl font-black uppercase tracking-tight">
                {isThai ? 'เขียนหาเรา' : 'Write to us'}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-white/75">
                {isThai
                  ? 'สำหรับการร่วมงาน สื่อมวลชน หรือคำถามเชิงโครงการ ทีมงานจะตอบกลับภายใน 2 วันทำการ'
                  : 'For partnerships, press, or programme questions. We respond within two business days.'}
              </p>
              <a
                href={`mailto:${office.email}`}
                className="mt-6 inline-flex items-center text-base font-black tracking-tight text-white border-b-2 border-brand-yellow pb-0.5 transition-colors hover:border-white"
              >
                {office.email} →
              </a>
            </article>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-yellow py-16 text-black">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-black uppercase tracking-tight md:text-4xl">
              {isThai ? 'ไม่ใช่กรณีฉุกเฉิน?' : 'Not an emergency?'}
            </h2>
            <p className="mt-3 text-sm text-black/80 md:text-base">
              {isThai
                ? 'เรียนรู้บริการของเราหรือร่วมสนับสนุนงานของ LPN'
                : 'Explore what we do, or help fund the work.'}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/services"
              className="rounded bg-black px-6 py-3 text-xs font-black uppercase tracking-widest text-brand-yellow transition-all hover:bg-white hover:text-black border border-black"
            >
              {isThai ? 'บริการของเรา' : 'See our services'}
            </Link>
            <Link
              href="/donate"
              className="rounded border border-black bg-transparent px-6 py-3 text-xs font-black uppercase tracking-widest text-black transition-all hover:bg-black hover:text-brand-yellow"
            >
              {isThai ? 'บริจาค' : 'Donate'}
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
