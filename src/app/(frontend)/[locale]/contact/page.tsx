import { WixIntegratedCopy } from '@/components/WixIntegratedCopy'
import { setRequestLocale } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'
import { routing } from '@/i18n/routing'
import { getPage } from '@/lib/api'
import { buildMetadata } from '@/lib/seo'
import { HOTLINES, OFFICE, telHref } from '@/lib/content'
import { Container, Section, SectionHeading, PageHero, CtaBand, ButtonLink } from '@/components/ui'

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

// Rich bilingual language labels kept from the original page; numbers come from
// the shared content module (src/lib/content.ts) so they can't drift apart.
const LANG_LABELS: Record<string, string> = {
  TH: 'ภาษาไทย (Thai)',
  MM: 'မြန်မာဘာသာ (Burmese)',
  KH: 'ភាសាខ្មែរ (Khmer)',
  LA: 'ພາສາລາວ (Lao)',
}

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
        name: OFFICE.nameTh,
        address: OFFICE.addressTh,
        email: OFFICE.email,
        hours: OFFICE.hoursTh,
      }
    : {
        name: OFFICE.nameEn,
        address: OFFICE.addressEn,
        email: OFFICE.email,
        hours: OFFICE.hoursEn,
      }

  return (
    <>
      {/* ---------------------------------------------------------------- HERO */}
      <PageHero
        compact
        eyebrow={isThai ? 'ติดต่อ LPN' : 'Contact LPN'}
        title={isThai ? 'หากคุณตกอยู่ในอันตราย — โทรหาเรา ตอนนี้' : 'If you are in danger — call us. Right now.'}
        lede={
          isThai
            ? 'สายด่วนของเราเปิดรับการแจ้งเหตุและคำขอความช่วยเหลือเป็นความลับ ในหลายภาษา ตลอด 24 ชั่วโมง'
            : 'Our hotlines take reports and assistance requests confidentially, in four languages, around the clock.'
        }
        stats={stats}
      />

      {/* ------------------------------------------------------ HOTLINE CARDS */}
      <Section tone="yellow" className="on-light">
        <Container>
          <SectionHeading
            eyebrow={isThai ? 'การช่วยเหลือฉุกเฉิน' : 'Emergency action'}
            title={isThai ? 'สายด่วนหลายภาษา' : 'Multilingual hotlines'}
            lede={
              isThai
                ? 'พูดในภาษาของคุณ ปลอดภัย เป็นความลับ และเชื่อมต่อกับทีมภาคสนามทันที'
                : 'Speak in your language. Safe, confidential, and connected to our field team in real time.'
            }
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {HOTLINES.map((h) => (
              <a
                key={h.code}
                href={telHref(h.phone)}
                className="card group flex flex-col p-6"
              >
                <div className="flex items-center justify-between">
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-black bg-brand-yellow text-xs font-black text-black"
                    aria-hidden="true"
                  >
                    {h.code}
                  </span>
                  <span className="t-label text-black/45">{isThai ? 'โทรเลย' : 'Tap to call'}</span>
                </div>
                <div className="mt-6 text-xs font-bold text-black/65">{LANG_LABELS[h.code]}</div>
                <div className="mt-2 border-b-2 border-brand-yellow pb-1 text-xl font-black tracking-tight text-black transition-colors group-hover:border-black">
                  {h.phone}
                </div>
              </a>
            ))}
          </div>
        </Container>
      </Section>

      {/* ------------------------------------------------------ OFFICE & EMAIL */}
      <Section tone="dark" className="border-y border-white/10">
        <Container>
          <div className="grid gap-10 md:grid-cols-2">
            <article className="glass-dark relative rounded p-8">
              <span className="absolute top-0 left-0 h-1.5 w-12 bg-brand-yellow" aria-hidden="true" />
              <div className="t-label text-brand-yellow">{isThai ? 'สำนักงาน' : 'Office'}</div>
              <h2 className="t-h3 mt-3 text-white">{office.name}</h2>
              <p className="mt-4 text-sm leading-relaxed text-white/75">{office.address}</p>
              <dl className="mt-6 grid gap-3 text-sm text-white/85">
                <div>
                  <dt className="t-label text-white/55">{isThai ? 'เวลาทำการ' : 'Office hours'}</dt>
                  <dd className="mt-1">{office.hours}</dd>
                </div>
              </dl>
            </article>
            <article className="glass-dark relative rounded p-8">
              <span className="absolute top-0 left-0 h-1.5 w-12 bg-brand-yellow" aria-hidden="true" />
              <div className="t-label text-brand-yellow">{isThai ? 'อีเมล' : 'Email'}</div>
              <h2 className="t-h3 mt-3 text-white">{isThai ? 'เขียนหาเรา' : 'Write to us'}</h2>
              <p className="mt-4 text-sm leading-relaxed text-white/75">
                {isThai
                  ? 'สำหรับการร่วมงาน สื่อมวลชน หรือคำถามเชิงโครงการ ทีมงานจะตอบกลับภายใน 2 วันทำการ'
                  : 'For partnerships, press, or programme questions. We respond within two business days.'}
              </p>
              <a
                href={`mailto:${office.email}`}
                className="link-mark mt-6 text-white hover:text-brand-yellow"
              >
                {office.email} →
              </a>
            </article>
          </div>
        </Container>
      </Section>

      {/* ---------------------------------------------------------------- CTA */}
      <CtaBand
        heading={isThai ? 'ไม่ใช่กรณีฉุกเฉิน?' : 'Not an emergency?'}
        body={
          isThai
            ? 'เรียนรู้บริการของเราหรือร่วมสนับสนุนงานของ LPN'
            : 'Explore what we do, or help fund the work.'
        }
        actions={
          <>
            <ButtonLink href="/services" variant="solidDark">
              {isThai ? 'บริการของเรา' : 'See our services'}
            </ButtonLink>
            <ButtonLink href="/donate" variant="ghostDark">
              {isThai ? 'บริจาค' : 'Donate'}
            </ButtonLink>
          </>
        }
      />
      <WixIntegratedCopy slug="contact" locale={locale} />
    </>
  )
}
