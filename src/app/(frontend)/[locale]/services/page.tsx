import { setRequestLocale } from 'next-intl/server'
import { ChevronDown, PhoneCall } from 'lucide-react'
import type { Locale } from '@/i18n/routing'
import { routing } from '@/i18n/routing'
import { getPage } from '@/lib/api'
import { buildMetadata } from '@/lib/seo'
import { servicesEn, servicesTh, type ServicesCopy, type Item } from '@/content/services'
import {
  Container,
  Section,
  SectionHeading,
  PageHero,
  CtaBand,
  ButtonLink,
} from '@/components/ui'

/** Deep-dive section: intro paragraphs + titled program blocks. */
function DeepDive({
  section,
  tone,
  isThai,
}: {
  section: { eyebrow: string; title: string; paras: string[]; items: Item[]; closing?: string[] }
  tone: 'light' | 'paper'
  isThai: boolean
}) {
  return (
    <Section tone={tone} className="on-light">
      <Container>
        <SectionHeading eyebrow={section.eyebrow} title={section.title} />
        {section.paras[0] && <p className="t-lede mt-8 max-w-3xl text-black/75">{section.paras[0]}</p>}
        <div className="mt-8 grid gap-3 md:grid-cols-2">
          {section.items.map((item, i) => (
            <details key={item.title} className="group border border-black/20 bg-white open:border-black">
              <summary className="flex min-h-24 cursor-pointer list-none items-center gap-4 p-5 marker:hidden [&::-webkit-details-marker]:hidden">
                <span className="text-2xl font-black text-black/40">0{i + 1}</span>
                <span className="flex-1 text-lg font-bold leading-snug">{item.title}</span>
                <ChevronDown size={22} className="shrink-0 transition-transform group-open:rotate-180" aria-hidden="true" />
              </summary>
              <p className="border-t border-black/15 px-5 pb-6 pt-4 text-base leading-relaxed whitespace-pre-line text-black/80">{item.body}</p>
            </details>
          ))}
        </div>
        {(section.paras.length > 1 || (section.closing?.length ?? 0) > 0) && <details className="group mt-6 max-w-3xl border-t border-black/20 pt-4">
          <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 font-bold underline decoration-brand-yellow decoration-2 underline-offset-4 marker:hidden [&::-webkit-details-marker]:hidden">
            {isThai ? 'อ่านรายละเอียดเพิ่มเติม' : 'Read more about this work'}
            <ChevronDown size={20} className="shrink-0 transition-transform group-open:rotate-180" aria-hidden="true" />
          </summary>
          {[...section.paras.slice(1), ...(section.closing ?? [])].map((p) => <p key={p.slice(0, 24)} className="mt-5 text-base leading-relaxed text-black/75">{p}</p>)}
        </details>}
      </Container>
    </Section>
  )
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata(props: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await props.params
  const page = await getPage('services', locale)
  return buildMetadata({
    locale,
    path: '/services',
    title: page?.meta?.title || 'Services',
    description:
      page?.meta?.description ||
      'How LPN works in practice — rescue, legal aid, rights education, and community protection.',
  })
}

export default async function ServicesPage(props: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await props.params
  setRequestLocale(locale)
  const isThai = locale === 'th'
  const copy: ServicesCopy = isThai ? servicesTh : servicesEn

  const journey = isThai
    ? [
        { step: 'A', label: 'แจ้งเหตุ', body: 'ติดต่อ LPN ผ่านหมายเลขตามภาษาที่ต้องการ' },
        { step: 'B', label: 'ประเมินและช่วยเหลือ', body: 'ภาคสนามเข้าถึงพื้นที่ ประสานหน่วยงานรัฐ' },
        { step: 'C', label: 'คุ้มครองและเยียวยา', body: 'บ้านพักปลอดภัย กฎหมาย และจิตสังคม' },
        { step: 'D', label: 'คืนสู่ชีวิตที่มีศักดิ์ศรี', body: 'การงาน การศึกษา และการรวมกลุ่มของผู้รอด' },
      ]
    : [
        { step: 'A', label: 'A case is reported', body: 'Contact LPN using the number for your language.' },
        { step: 'B', label: 'Assessment & rescue', body: 'Field team mobilises and coordinates with authorities.' },
        { step: 'C', label: 'Protect & heal', body: 'Safe shelter, legal aid, and psychosocial recovery.' },
        { step: 'D', label: 'Return to dignity', body: 'Livelihoods, education, and survivor-led networks.' },
      ]

  return (
    <>
      {/* ---------------------------------------------------------------- HERO */}
      <PageHero
        compact
        backgroundImage="/images/fisher-protection.jpg"
        backgroundAlt={isThai ? 'งานคุ้มครองและบริการช่วยเหลือแรงงาน LPN' : 'LPN worker protection services'}
        eyebrow={copy.hero.eyebrow}
        title={isThai ? 'LPN ช่วยแรงงานอย่างไร' : 'How LPN helps workers'}
        lede={isThai ? 'รับฟังปัญหา ช่วยเหลือ และทำงานกับชุมชน' : 'We listen, respond, and work alongside communities.'}
      />

      {/* Worker route stays visible before the detailed programme copy. */}
      <Section tone="yellow" tight className="on-light">
        <Container className="grid gap-5 sm:grid-cols-[auto_1fr_auto] sm:items-center">
          <PhoneCall size={42} strokeWidth={1.7} aria-hidden="true" />
          <p className="t-h3">{isThai ? 'มีปัญหาเรื่องงานหรือความปลอดภัย?' : 'Need help with work or safety?'}</p>
          <ButtonLink href="/get-help" variant="solidDark">{isThai ? 'ติดต่อ LPN' : 'Contact LPN'}</ButtonLink>
        </Container>
      </Section>

      <Section tone="light" tight className="on-light">
        <Container>
          <details className="group max-w-3xl border-b border-black/20 pb-4">
            <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 font-bold underline decoration-brand-yellow decoration-2 underline-offset-4 marker:hidden [&::-webkit-details-marker]:hidden">
              {isThai ? 'เกี่ยวกับงานบริการของ LPN' : 'About LPN’s services'}
              <ChevronDown size={20} className="shrink-0 transition-transform group-open:rotate-180" aria-hidden="true" />
            </summary>
            <p className="mt-5 font-bold">{copy.hero.title}</p>
            <p className="mt-3 text-base leading-relaxed text-black/75">{copy.hero.lede}</p>
            <p className="mt-3 text-base leading-relaxed text-black/75">{copy.hero.lede2}</p>
          </details>
        </Container>
      </Section>

      {/* PROGRAM CARDS */}
      <Section tone="paper" className="on-light">
        <Container>
          <SectionHeading title={copy.programsTitle} />
          <div className="mt-8 grid gap-3 md:grid-cols-2">
            {copy.programs.map((p, i) => (
              <details key={p.title} className="group border border-black/20 bg-white open:border-black">
                <summary className="flex min-h-28 cursor-pointer list-none items-center gap-4 p-5 marker:hidden [&::-webkit-details-marker]:hidden">
                  <span className="text-3xl font-black text-black/40">0{i + 1}</span>
                  <span className="flex-1 text-lg font-bold leading-snug">{p.title}</span>
                  <ChevronDown size={22} className="shrink-0 transition-transform group-open:rotate-180" aria-hidden="true" />
                </summary>
                <p className="border-t border-black/15 px-5 pb-6 pt-4 text-base leading-relaxed text-black/80">{p.body}</p>
              </details>
            ))}
          </div>
        </Container>
      </Section>

      {/* DEEP DIVES */}
      <DeepDive section={copy.raid} tone="light" isThai={isThai} />
      <DeepDive section={copy.advocacy} tone="paper" isThai={isThai} />
      <DeepDive section={copy.education} tone="light" isThai={isThai} />

      {/* JOURNEY */}
      <Section tone="dark" className="border-y border-white/10">
        <Container>
          <SectionHeading
            tone="light"
            eyebrow={isThai ? 'เส้นทางการช่วยเหลือ' : 'How a case moves'}
            title={isThai ? 'จากสายโทรศัพท์สู่ชีวิตที่มีศักดิ์ศรี' : 'From a phone call to a life restored.'}
          />
          <ol className="mt-12 grid gap-4 md:grid-cols-4">
            {journey.map((j, i) => (
              <li key={j.step} className="glass-dark relative rounded p-6">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-black text-brand-yellow">{j.step}</span>
                  <span className="t-label text-white/70">
                    {isThai ? 'ขั้นที่' : 'Step'} {i + 1}
                  </span>
                </div>
                <div className="mt-4 text-base font-bold tracking-tight">{j.label}</div>
                <p className="mt-2 text-sm leading-relaxed text-white/70">{j.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* ---------------------------------------------------------------- CTA */}
      <CtaBand
        heading={isThai ? 'พบเหตุที่ต้องการความช่วยเหลือ?' : 'Need to report a case?'}
        body={
          isThai
            ? 'ติดต่อ LPN ผ่านหมายเลขตามภาษาที่ต้องการ หากยังไม่แน่ใจว่าจะใช้ช่องทางใด ดูหน้าขอความช่วยเหลือ'
            : 'Contact LPN using the number for your language. If you are unsure which channel to use, see Get Help.'
        }
        actions={
          <>
            <ButtonLink href="/contact" variant="solidDark">
              {isThai ? 'ติดต่อทันที' : 'Contact now'}
            </ButtonLink>
            <ButtonLink href="/donate" variant="ghostDark">
              {isThai ? 'บริจาค' : 'Donate'}
            </ButtonLink>
          </>
        }
      />
    </>
  )
}
