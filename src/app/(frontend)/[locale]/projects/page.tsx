import { setRequestLocale } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'
import { routing } from '@/i18n/routing'
import { getPage } from '@/lib/api'
import { buildMetadata } from '@/lib/seo'
import { projectsEn, projectsTh, type ProjectsCopy, type Partner } from '@/content/projects'
import { getPartnerProjects } from '@/content/partnerProjects'
import { PartnerTimeline } from '@/components/PartnerTimeline'
import {
  Container,
  Section,
  SectionHeading,
  PageHero,
  CtaBand,
  ButtonLink,
  EditorialRow,
} from '@/components/ui'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata(props: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await props.params
  const page = await getPage('projects', locale)
  return buildMetadata({
    locale,
    path: '/projects',
    title: page?.meta?.title || 'Projects & Partners',
    description:
      page?.meta?.description ||
      'LPN projects, partners, funders, and collaborative initiatives advancing labour rights.',
  })
}

function PartnerEntry({ p }: { p: Partner }) {
  return (
    <article className="card card-marked p-8">
      <h3 className="t-h3">{p.name}</h3>
      {p.tagline && <p className="mt-2 text-sm font-bold text-black/70 italic">{p.tagline}</p>}
      {p.years && <p className="t-label mt-2 text-black/70">{p.years}</p>}
      <p className="mt-4 text-sm leading-relaxed text-black/75">{p.body}</p>
    </article>
  )
}

export default async function ProjectsPage(props: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await props.params
  setRequestLocale(locale)
  const isThai = locale === 'th'
  const copy: ProjectsCopy = isThai ? projectsTh : projectsEn

  const stats = isThai
    ? [
        { value: '7', label: 'ผู้ให้ทุนหลัก' },
        { value: '6', label: 'ประเด็นที่ทำงาน' },
        { value: '2', label: 'เครือข่ายแรงงานที่หนุนเสริม' },
      ]
    : [
        { value: '7', label: 'core funders' },
        { value: '6', label: 'priority issues' },
        { value: '2', label: 'worker networks supported' },
      ]

  const issues = isThai
    ? [
        { number: '01', title: 'สิทธิมนุษยชน & แรงงาน', body: 'ปกป้องและขยายสิทธิของแรงงานข้ามชาติทั้งบนบกและในทะเล' },
        { number: '02', title: 'การฟื้นฟูผู้รอด & บ้านพัก', body: 'การฟื้นฟูจิตใจ บ้านพักปลอดภัย และการกลับคืนสู่ชุมชนอย่างมีศักดิ์ศรี' },
        { number: '03', title: 'การป้องกันการค้ามนุษย์', body: 'ระบบเฝ้าระวัง สายด่วน และความร่วมมือกับหน่วยงานรัฐและเอกชน' },
        { number: '04', title: 'สุขภาพทั่วไปและอนามัยเจริญพันธุ์', body: 'การเข้าถึงบริการสุขภาพและสิทธิอนามัยเจริญพันธุ์สำหรับแรงงานข้ามชาติ' },
        { number: '05', title: 'การป้องกันแรงงานเด็ก', body: 'หยุดยั้งการใช้แรงงานเด็กในห่วงโซ่อุปทานและชุมชนแรงงานข้ามชาติ' },
        { number: '06', title: 'การศึกษาสำหรับเด็กข้ามชาติ', body: 'เปิดเส้นทางการเรียนรู้และการเข้าถึงการศึกษาภาครัฐของไทย' },
      ]
    : [
        { number: '01', title: 'Human & labour rights', body: 'Defend and expand the rights of migrant workers — both onshore and at sea.' },
        { number: '02', title: 'Trauma recovery & shelter', body: 'Psychosocial healing, safe shelters, and dignified reintegration with families and communities.' },
        { number: '03', title: 'Anti-trafficking prevention', body: 'Hotlines, early-warning networks, and cooperation with state and private actors.' },
        { number: '04', title: 'Health & reproductive rights', body: 'Access to general and reproductive health services for migrant worker communities.' },
        { number: '05', title: 'Child labour prevention', body: 'Stop child labour in supply chains and in migrant-worker communities.' },
        { number: '06', title: 'Education for migrant children', body: 'Open pathways into Thai public education and tutoring support.' },
      ]

  const partners = [
    'JTIP',
    'Plan International',
    'Freedom Fund',
    'GVC Italy',
    'Safe Child Thailand',
    'Ashoka Foundation',
    'Embassy of Japan',
  ]

  return (
    <>
      {/* ---------------------------------------------------------------- HERO */}
      <PageHero
        compact
        eyebrow={isThai ? 'พันธมิตรของเรา' : 'Our partners'}
        title={isThai ? 'การเปลี่ยนแปลงที่ยั่งยืนเกิดจากการทำงานร่วมกัน' : 'Lasting change is built in coalition.'}
        lede={
          isThai
            ? 'LPN ทำงานร่วมกับผู้ให้ทุน ภาคประชาสังคม เครือข่ายแรงงาน และพันธมิตรระหว่างประเทศ เพื่อขับเคลื่อนงานต้านการค้ามนุษย์และพัฒนาสิทธิแรงงานในไทย'
            : 'LPN works with funders, civic groups, worker networks, and international partners to drive anti-trafficking action and improve labour rights in Thailand.'
        }
        stats={stats}
      />

      {/* AREAS OF FOCUS */}
      <Section tone="light" className="on-light">
        <Container>
          <SectionHeading
            eyebrow={isThai ? 'ประเด็นที่เราขับเคลื่อน' : 'Areas of focus'}
            title={isThai ? 'ประเด็นที่เราขับเคลื่อน' : 'Priority issues we drive'}
          />
          <div className="mt-12">
            {issues.map((i) => (
              <EditorialRow key={i.number} index={i.number} title={i.title} body={i.body} />
            ))}
          </div>
        </Container>
      </Section>

      {/* PARTNERS STRIP */}
      <Section tone="dark" tight className="border-y border-white/10">
        <Container>
          <SectionHeading
            tone="light"
            eyebrow={isThai ? 'พันธมิตรของเรา' : 'Our partners'}
            title={isThai ? 'ผู้ให้ทุน องค์กรประชาสังคม และพันธมิตรระหว่างประเทศ' : 'Funders, civil society, and international allies.'}
          />
          <ul className="mt-10 grid grid-cols-2 gap-px overflow-hidden border border-white/15 bg-white/10 sm:grid-cols-3 lg:grid-cols-7">
            {partners.map((p) => (
              <li
                key={p}
                className="flex h-24 items-center justify-center bg-black px-4 text-center text-xs font-black tracking-widest text-white uppercase transition-colors hover:bg-white/5 hover:text-brand-yellow"
              >
                {p}
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* HISTORICAL FUNDERS */}
      <Section tone="paper" className="on-light">
        <Container>
          <SectionHeading title={isThai ? 'โครงการและความร่วมมือที่ผ่านมา' : 'Past projects and collaborations'} lede={isThai ? 'สำรวจความร่วมมือที่บันทึกไว้บนเว็บไซต์เดิมตามปี ข้อมูลนี้เป็นประวัติการทำงาน ไม่ใช่รายชื่อโครงการที่กำลังดำเนินอยู่' : 'Explore collaborations documented on the former website by year. These are historical projects, not a list of current grants.'} />
          <PartnerTimeline locale={locale} projects={getPartnerProjects(locale)} />
          <a href={isThai ? 'https://www.lpnfoundation.org/th/projects' : 'https://www.lpnfoundation.org/projects'} target="_blank" rel="noreferrer" className="mt-8 inline-block text-sm font-bold underline decoration-brand-yellow decoration-2 underline-offset-4">
            {isThai ? 'ดูข้อมูลต้นฉบับบนเว็บไซต์เดิม' : 'View the original project page'} ↗
          </a>
        </Container>
      </Section>

      {/* EXTENDED NETWORK (live copy) */}
      <Section tone="light" className="on-light">
        <Container>
          <SectionHeading title={copy.network.title} lede={copy.network.intro} />
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {copy.network.items.map((p) => (
              <PartnerEntry key={p.name} p={p} />
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA (live copy) */}
      <CtaBand
        heading={copy.cta.heading}
        body={copy.cta.body}
        actions={
          <>
            <ButtonLink href="/contact" variant="solidDark">
              {isThai ? 'ติดต่อร่วมงาน' : 'Get in touch'}
            </ButtonLink>
            <ButtonLink href="/donate" variant="ghostDark">
              {isThai ? 'สนับสนุนโครงการ' : 'Fund a project'}
            </ButtonLink>
          </>
        }
      />
    </>
  )
}
