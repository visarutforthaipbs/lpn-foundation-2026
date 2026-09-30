import { WixIntegratedCopy } from '@/components/WixIntegratedCopy'
import { setRequestLocale } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'
import { routing } from '@/i18n/routing'
import { getPage } from '@/lib/api'
import { buildMetadata } from '@/lib/seo'
import {
  Container,
  Section,
  SectionHeading,
  PageHero,
  CtaBand,
  ButtonLink,
  EditorialRow,
  MarkLink,
} from '@/components/ui'

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

type Service = {
  number: string
  title: string
  body: string
  outcomes: string[]
  cta: { label: string; href: string }
}

export default async function ServicesPage(props: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await props.params
  setRequestLocale(locale)
  const isThai = locale === 'th'

  const services: Service[] = isThai
    ? [
        {
          number: '01',
          title: 'การช่วยเหลือและคุ้มครองผู้เสียหาย',
          body: 'ตอบสนองต่อเหตุค้ามนุษย์และการละเมิดแรงงานขั้นรุนแรง ด้วยการช่วยเหลือโดยตรง ประสานบ้านพักปลอดภัย เยียวยาจิตใจ และสนับสนุนคดีทางกฎหมาย',
          outcomes: [
            'ปฏิบัติการกู้ภัยข้ามพรมแดน',
            'ประสานบ้านพักและเยียวยาจิตใจ',
            'สนับสนุนคดีในชั้นศาล',
          ],
          cta: { label: 'ดูสายด่วนฉุกเฉิน', href: '/contact' },
        },
        {
          number: '02',
          title: 'การให้ความช่วยเหลือทางกฎหมาย',
          body: 'ทีมกฎหมายให้คำปรึกษาและเป็นตัวแทนแรงงานข้ามชาติในกรณีค่าจ้างค้างจ่าย การปฏิบัติมิชอบ และการเข้าถึงกระบวนการยุติธรรม',
          outcomes: ['ทวงค่าจ้างค้างจ่าย', 'ดำเนินคดีการละเมิดสิทธิ', 'ให้คำปรึกษาแก่ผู้ร้องเรียน'],
          cta: { label: 'ติดต่อทีมกฎหมาย', href: '/contact' },
        },
        {
          number: '03',
          title: 'การสื่อสารสิทธิและการผลักดันเชิงนโยบาย',
          body: 'อบรมแรงงานในภาษาของตนเองเรื่องสิทธิ ช่องทางร้องเรียน และการย้ายถิ่นปลอดภัย พร้อมขับเคลื่อนนโยบายร่วมกับรัฐและภาคประชาสังคม',
          outcomes: ['สื่อความรู้หลายภาษา', 'เครือข่ายอาสาสมัครแรงงาน', 'การผลักดันเชิงนโยบาย'],
          cta: { label: 'อ่านโครงการของเรา', href: '/projects' },
        },
        {
          number: '04',
          title: 'การศึกษาเพื่อเด็กข้ามชาติ',
          body: 'สนับสนุนเส้นทางการเรียนรู้และการเข้าถึงการศึกษาภาครัฐของเด็กข้ามชาติ เพื่อป้องกันการถูกกีดกันและตัดวงจรการแสวงหาประโยชน์ระหว่างรุ่น',
          outcomes: [
            'ส่งเด็กเข้าเรียนในระบบ',
            'เครือข่ายเยาวชนข้ามชาติ',
            'ครอบครัวเข้าถึงสวัสดิการ',
          ],
          cta: { label: 'สนับสนุนการเรียน', href: '/donate' },
        },
      ]
    : [
        {
          number: '01',
          title: 'Rescue & Victim Protection',
          body: 'LPN responds to trafficking and severe labour-abuse cases through direct assistance, safe-shelter coordination, psychosocial support, and legal case follow-through.',
          outcomes: [
            'Cross-border rescue operations',
            'Shelter & psychosocial recovery',
            'Court-case accompaniment',
          ],
          cta: { label: 'Emergency hotlines', href: '/contact' },
        },
        {
          number: '02',
          title: 'Legal Assistance',
          body: 'Our legal team advises and represents migrant workers on unpaid wages, abuse cases, and access to justice — turning isolated complaints into accountable outcomes.',
          outcomes: [
            'Wage recovery cases',
            'Rights-violation litigation',
            'Complainant counselling',
          ],
          cta: { label: 'Talk to legal team', href: '/contact' },
        },
        {
          number: '03',
          title: 'Rights Communication & Advocacy',
          body: 'We train workers in their own languages on rights, complaint channels, and safe migration — while pushing state and civil-society actors toward stronger protections.',
          outcomes: [
            'Multilingual rights training',
            'Worker volunteer networks',
            'Policy & supply-chain advocacy',
          ],
          cta: { label: 'See our projects', href: '/projects' },
        },
        {
          number: '04',
          title: 'Education for Migrant Children',
          body: 'We open learning pathways and access to Thai public education for migrant children — preventing exclusion and breaking intergenerational exploitation.',
          outcomes: ['School enrolment support', 'Migrant youth networks', 'Family welfare access'],
          cta: { label: 'Fund a learner', href: '/donate' },
        },
      ]

  const journey = isThai
    ? [
        { step: 'A', label: 'แจ้งเหตุ', body: 'สายด่วนหลายภาษา เปิดรับตลอด 24 ชั่วโมง' },
        {
          step: 'B',
          label: 'ประเมินและช่วยเหลือ',
          body: 'ภาคสนามเข้าถึงพื้นที่ ประสานหน่วยงานรัฐ',
        },
        { step: 'C', label: 'คุ้มครองและเยียวยา', body: 'บ้านพักปลอดภัย กฎหมาย และจิตสังคม' },
        {
          step: 'D',
          label: 'คืนสู่ชีวิตที่มีศักดิ์ศรี',
          body: 'การงาน การศึกษา และการรวมกลุ่มของผู้รอด',
        },
      ]
    : [
        {
          step: 'A',
          label: 'A case is reported',
          body: 'Multilingual hotline open around the clock.',
        },
        {
          step: 'B',
          label: 'Assessment & rescue',
          body: 'Field team mobilises and coordinates with authorities.',
        },
        {
          step: 'C',
          label: 'Protect & heal',
          body: 'Safe shelter, legal aid, and psychosocial recovery.',
        },
        {
          step: 'D',
          label: 'Return to dignity',
          body: 'Livelihoods, education, and survivor-led networks.',
        },
      ]

  const stats = isThai
    ? [
        { value: '15+', label: 'ปีของการทำงานภาคสนาม' },
        { value: '4', label: 'เสาหลักของบริการ' },
        { value: '24/7', label: 'สายด่วนหลายภาษา' },
      ]
    : [
        { value: '15+', label: 'years on the frontline' },
        { value: '4', label: 'service pillars' },
        { value: '24/7', label: 'multilingual hotline' },
      ]

  return (
    <>
      {/* ---------------------------------------------------------------- HERO */}
      <PageHero
        compact
        eyebrow={isThai ? 'บริการของ LPN' : 'What LPN does'}
        title={
          isThai
            ? 'สี่เสาหลักที่หยุดวงจรการแสวงหาประโยชน์จากแรงงาน'
            : 'Four pillars that break the cycle of labour exploitation.'
        }
        lede={
          isThai
            ? 'จากการช่วยชีวิตในทะเลถึงห้องเรียนของลูกแรงงานข้ามชาติ บริการของเราถูกหล่อหลอมจากประสบการณ์ภาคสนามกว่า 15 ปีกับชุมชนแรงงาน'
            : 'From open-sea rescues to classrooms for migrant children, our services are built from 15+ years of frontline work with migrant communities.'
        }
        stats={stats}
      />

      {/* ------------------------------------------------------- SERVICE PILLARS */}
      <Section tone="light" className="on-light">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-8">
            <SectionHeading
              title={isThai ? 'บริการ' : 'Our services'}
              lede={
                isThai
                  ? 'งานของเราเชื่อมโยงกัน — การช่วยเหลือนำไปสู่กระบวนการยุติธรรม การศึกษา และการรวมพลังของผู้รอด'
                  : 'Every pillar feeds the next — rescue leads to justice, justice into education, education into worker-led power.'
              }
            />
            <ButtonLink href="/donate" variant="primary">
              {isThai ? 'สนับสนุนภารกิจ' : 'Fund the mission'}
            </ButtonLink>
          </div>

          <div className="mt-12">
            {services.map((s) => (
              <EditorialRow
                key={s.number}
                index={`${isThai ? 'เสาหลัก' : 'Pillar'} ${s.number}`}
                title={s.title}
                body={s.body}
                meta={
                  <ul className="flex flex-wrap gap-x-6 gap-y-2">
                    {s.outcomes.map((o) => (
                      <li key={o} className="flex items-center gap-2.5 text-sm text-black/80">
                        <span className="inline-block h-1 w-3 shrink-0 bg-brand-yellow" aria-hidden="true" />
                        {o}
                      </li>
                    ))}
                  </ul>
                }
                actions={<MarkLink href={s.cta.href} className="text-black">{s.cta.label} →</MarkLink>}
              />
            ))}
          </div>
        </Container>
      </Section>

      {/* -------------------------------------------------------------- JOURNEY */}
      <Section tone="dark" className="border-y border-white/10">
        <Container>
          <SectionHeading
            tone="light"
            eyebrow={isThai ? 'เส้นทางการช่วยเหลือ' : 'How a case moves'}
            title={
              isThai ? 'จากสายโทรศัพท์สู่ชีวิตที่มีศักดิ์ศรี' : 'From a phone call to a life restored.'
            }
          />
          <ol className="mt-12 grid gap-4 md:grid-cols-4">
            {journey.map((j, i) => (
              <li key={j.step} className="glass-dark relative rounded p-6">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-black text-brand-yellow">{j.step}</span>
                  <span className="t-label text-white/45">
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
            ? 'สายด่วนของเราเปิดรับการแจ้งเหตุและการขอความช่วยเหลือเป็นความลับ ในหลายภาษา ตลอด 24 ชั่วโมง'
            : 'Our multilingual hotline takes reports and assistance requests in confidence, around the clock.'
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
      <WixIntegratedCopy slug="services" locale={locale} />
    </>
  )
}
