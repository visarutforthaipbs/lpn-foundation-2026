import { setRequestLocale } from 'next-intl/server'
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
  EditorialRow,
} from '@/components/ui'

/** Deep-dive section: intro paragraphs + titled program blocks. */
function DeepDive({
  section,
  tone,
}: {
  section: { eyebrow: string; title: string; paras: string[]; items: Item[]; closing?: string[] }
  tone: 'light' | 'paper'
}) {
  return (
    <Section tone={tone} className="on-light">
      <Container>
        <SectionHeading eyebrow={section.eyebrow} title={section.title} />
        <div className="mt-8 max-w-3xl">
          {section.paras.map((p) => (
            <p key={p.slice(0, 24)} className="t-lede mt-5 text-black/75">{p}</p>
          ))}
        </div>
        <div className="mt-12">
          {section.items.map((item, i) => (
            <EditorialRow key={item.title} index={`0${i + 1}`} title={item.title} body={<span className="whitespace-pre-line">{item.body}</span>} />
          ))}
        </div>
        {section.closing && section.closing.length > 0 && (
          <div className="mt-12 max-w-3xl border-t border-black/15 pt-8">
            {section.closing.map((p) => (
              <p key={p.slice(0, 24)} className="mt-5 text-base leading-relaxed text-black/75">{p}</p>
            ))}
          </div>
        )}
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
        eyebrow={copy.hero.eyebrow}
        title={copy.hero.title}
        lede={copy.hero.lede}
      />

      {/* LEDE 2 */}
      <Section tone="light" tight className="on-light">
        <Container>
          <p className="t-lede max-w-3xl text-black/75">{copy.hero.lede2}</p>
        </Container>
      </Section>

      {/* PROGRAM CARDS */}
      <Section tone="paper" className="on-light">
        <Container>
          <SectionHeading title={copy.programsTitle} />
          <div className="mt-12">
            {copy.programs.map((p, i) => (
              <EditorialRow
                key={p.title}
                index={`0${i + 1}`}
                title={p.title}
                body={p.body}
              />
            ))}
          </div>
        </Container>
      </Section>

      {/* DEEP DIVES */}
      <DeepDive section={copy.raid} tone="light" />
      <DeepDive section={copy.advocacy} tone="paper" />
      <DeepDive section={copy.education} tone="light" />

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
