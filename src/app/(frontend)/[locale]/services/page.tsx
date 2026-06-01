import { setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { routing } from '@/i18n/routing'
import { getPage } from '@/lib/api'
import { buildMetadata } from '@/lib/seo'
import Image from 'next/image'

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
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-white/10 bg-black text-white">
        <Image
          src="/images/trawler-hero.jpg"
          alt="Fishing trawler hero background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-25"
          {...({ fetchPriority: 'high' } as any)}
        />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/70 to-black/30" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 md:py-32">
          <div className="max-w-3xl">
            <span className="inline-flex rounded glass-tag px-3 py-1 text-[10px] font-black uppercase tracking-[0.25em] text-brand-yellow">
              {isThai ? 'บริการของ LPN' : 'What LPN does'}
            </span>
            <h1 className="mt-6 text-4xl font-black leading-[1.05] tracking-tight text-balance md:text-6xl">
              {isThai
                ? 'สี่เสาหลักที่หยุดวงจรการแสวงหาประโยชน์จากแรงงาน'
                : 'Four pillars that break the cycle of labour exploitation.'}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/85 md:text-lg">
              {isThai
                ? 'จากการช่วยชีวิตในทะเลถึงห้องเรียนของลูกแรงงานข้ามชาติ บริการของเราถูกหล่อหลอมจากประสบการณ์ภาคสนามกว่า 15 ปีกับชุมชนแรงงาน'
                : 'From open-sea rescues to classrooms for migrant children, our services are built from 15+ years of frontline work with migrant communities.'}
            </p>
          </div>

          <dl className="mt-12 grid grid-cols-3 gap-4 max-w-2xl border-l-4 border-brand-yellow pl-6">
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

      {/* SERVICES GRID */}
      <section className="border-b border-black bg-white py-20 text-black md:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-xl">
              <h2 className="text-3xl font-black uppercase tracking-tight md:text-5xl">
                {isThai ? 'บริการ' : 'Our services'}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-black/70">
                {isThai
                  ? 'งานของเราเชื่อมโยงกัน — การช่วยเหลือนำไปสู่กระบวนการยุติธรรม การศึกษา และการรวมพลังของผู้รอด'
                  : 'Every pillar feeds the next — rescue leads to justice, justice into education, education into worker-led power.'}
              </p>
            </div>
            <Link
              href="/donate"
              className="rounded bg-brand-yellow px-6 py-3 text-xs font-black uppercase tracking-widest text-black transition-all hover:bg-black hover:text-brand-yellow border border-transparent hover:border-brand-yellow"
            >
              {isThai ? 'สนับสนุนภารกิจ' : 'Fund the mission'}
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {services.map((s) => (
              <article
                key={s.number}
                className="group relative overflow-hidden rounded border border-black bg-white p-8 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="absolute top-0 left-0 h-full w-1.5 bg-brand-yellow" />
                <div className="flex items-start justify-between gap-4 pl-3">
                  <span className="text-xs font-black uppercase tracking-[0.25em] text-black/40">
                    {isThai ? 'เสาหลัก' : 'Pillar'} {s.number}
                  </span>
                </div>
                <h3 className="mt-3 pl-3 text-2xl font-black uppercase tracking-tight md:text-3xl">
                  {s.title}
                </h3>
                <p className="mt-4 pl-3 text-sm leading-relaxed text-black/75">{s.body}</p>

                <ul className="mt-6 pl-3 grid gap-2 text-sm text-black/85">
                  {s.outcomes.map((o) => (
                    <li key={o} className="flex gap-3">
                      <span className="mt-2 inline-block h-1 w-3 shrink-0 bg-brand-yellow" />
                      <span>{o}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 pl-3">
                  <Link
                    href={s.cta.href}
                    className="inline-flex items-center text-xs font-black uppercase tracking-widest text-black border-b-2 border-brand-yellow pb-0.5 transition-all group-hover:border-black"
                  >
                    {s.cta.label} →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* JOURNEY / PROCESS */}
      <section className="border-b border-white/10 bg-black py-20 text-white md:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="max-w-2xl">
            <span className="inline-flex rounded glass-tag px-3 py-1 text-[10px] font-black uppercase tracking-[0.25em] text-brand-yellow">
              {isThai ? 'เส้นทางการช่วยเหลือ' : 'How a case moves'}
            </span>
            <h2 className="mt-6 text-3xl font-black uppercase tracking-tight md:text-4xl">
              {isThai
                ? 'จากสายโทรศัพท์สู่ชีวิตที่มีศักดิ์ศรี'
                : 'From a phone call to a life restored.'}
            </h2>
          </div>

          <ol className="mt-12 grid gap-4 md:grid-cols-4">
            {journey.map((j, i) => (
              <li key={j.step} className="relative glass-dark rounded p-6">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-black text-brand-yellow">{j.step}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/45">
                    {isThai ? 'ขั้นที่' : 'Step'} {i + 1}
                  </span>
                </div>
                <div className="mt-4 text-base font-bold uppercase tracking-tight">{j.label}</div>
                <p className="mt-2 text-sm leading-relaxed text-white/70">{j.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-yellow py-16 text-black">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-black uppercase tracking-tight md:text-4xl">
              {isThai ? 'พบเหตุที่ต้องการความช่วยเหลือ?' : 'Need to report a case?'}
            </h2>
            <p className="mt-3 text-sm text-black/80 md:text-base">
              {isThai
                ? 'สายด่วนของเราเปิดรับการแจ้งเหตุและการขอความช่วยเหลือเป็นความลับ ในหลายภาษา ตลอด 24 ชั่วโมง'
                : 'Our multilingual hotline takes reports and assistance requests in confidence, around the clock.'}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="rounded bg-black px-6 py-3 text-xs font-black uppercase tracking-widest text-brand-yellow transition-all hover:bg-white hover:text-black border border-black"
            >
              {isThai ? 'ติดต่อทันที' : 'Contact now'}
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
