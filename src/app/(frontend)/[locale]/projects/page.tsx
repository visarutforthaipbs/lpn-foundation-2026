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
  EditorialRow,
  ButtonLink,
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

export default async function ProjectsPage(props: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await props.params
  setRequestLocale(locale)
  const isThai = locale === 'th'

  const stats = isThai
    ? [
        { value: '10+', label: 'พันธมิตรหลัก' },
        { value: '6', label: 'ประเด็นที่ทำงาน' },
        { value: '2', label: 'เครือข่ายแรงงานที่หนุนเสริม' },
      ]
    : [
        { value: '10+', label: 'core partners' },
        { value: '6', label: 'priority issues' },
        { value: '2', label: 'worker networks supported' },
      ]

  const partners = [
    'JTIP',
    'Plan International',
    'Freedom Fund',
    'GVC Italy',
    'Safe Child Thailand',
    'Ashoka Foundation',
  ]

  const issues = isThai
    ? [
        {
          number: '01',
          title: 'สิทธิมนุษยชน & แรงงาน',
          body: 'ปกป้องและขยายสิทธิของแรงงานข้ามชาติทั้งบนบกและในทะเล',
        },
        {
          number: '02',
          title: 'การฟื้นฟูผู้รอด & บ้านพัก',
          body: 'การฟื้นฟูจิตใจ บ้านพักปลอดภัย และการกลับคืนสู่ชุมชนอย่างมีศักดิ์ศรี',
        },
        {
          number: '03',
          title: 'การป้องกันการค้ามนุษย์',
          body: 'ระบบเฝ้าระวัง สายด่วน และความร่วมมือกับหน่วยงานรัฐและเอกชน',
        },
        {
          number: '04',
          title: 'สุขภาพทั่วไปและอนามัยเจริญพันธุ์',
          body: 'การเข้าถึงบริการสุขภาพและสิทธิอนามัยเจริญพันธุ์สำหรับแรงงานข้ามชาติ',
        },
        {
          number: '05',
          title: 'การป้องกันแรงงานเด็ก',
          body: 'หยุดยั้งการใช้แรงงานเด็กในห่วงโซ่อุปทานและชุมชนแรงงานข้ามชาติ',
        },
        {
          number: '06',
          title: 'การศึกษาสำหรับเด็กข้ามชาติ',
          body: 'เปิดเส้นทางการเรียนรู้และการเข้าถึงการศึกษาภาครัฐของไทย',
        },
      ]
    : [
        {
          number: '01',
          title: 'Human & labour rights',
          body: 'Defend and expand the rights of migrant workers — both onshore and at sea.',
        },
        {
          number: '02',
          title: 'Trauma recovery & shelter',
          body: 'Psychosocial healing, safe shelters, and dignified reintegration with families and communities.',
        },
        {
          number: '03',
          title: 'Anti-trafficking prevention',
          body: 'Hotlines, early-warning networks, and cooperation with state and private actors.',
        },
        {
          number: '04',
          title: 'Health & reproductive rights',
          body: 'Access to general and reproductive health services for migrant worker communities.',
        },
        {
          number: '05',
          title: 'Child labour prevention',
          body: 'Stop child labour in supply chains and in migrant-worker communities.',
        },
        {
          number: '06',
          title: 'Education for migrant children',
          body: 'Open pathways into Thai public education and tutoring support.',
        },
      ]

  const networks = isThai
    ? [
        {
          tag: 'เครือข่ายแรงงาน',
          name: 'กลุ่มสหภาพแรงงานประมงไทยและข้ามชาติ',
          body: 'เครือข่ายแรงงานประมงที่ผลักดันความรับผิดชอบและธรรมาภิบาลในอุตสาหกรรมประมงของไทย',
        },
        {
          tag: 'เครือข่ายแรงงาน',
          name: 'MAST',
          body: 'พันธมิตรเชิงโครงสร้างเพื่อความโปร่งใสและความยุติธรรมในห่วงโซ่อุปทานสินค้าทะเล',
        },
      ]
    : [
        {
          tag: 'Worker network',
          name: 'Thai & Migrant Fishers Union Group',
          body: 'A fisher-led network pushing accountability and governance in Thai fisheries.',
        },
        {
          tag: 'Worker network',
          name: 'MAST',
          body: 'A structural alliance for transparency and justice across the seafood supply chain.',
        },
      ]

  return (
    <>
      {/* ---------------------------------------------------------------- HERO */}
      <PageHero
        compact
        eyebrow={isThai ? 'โครงการ & พันธมิตร' : 'Projects & partners'}
        title={
          isThai
            ? 'การเปลี่ยนแปลงที่ยั่งยืนเกิดจากการทำงานร่วมกัน'
            : 'Lasting change is built in coalition.'
        }
        lede={
          isThai
            ? 'LPN ทำงานร่วมกับผู้ให้ทุน ภาคประชาสังคม เครือข่ายแรงงาน และพันธมิตรระหว่างประเทศ เพื่อขับเคลื่อนงานต้านการค้ามนุษย์และพัฒนาสิทธิแรงงานในไทย'
            : 'LPN works with funders, civic groups, worker networks, and international partners to drive anti-trafficking action and improve labour rights in Thailand.'
        }
        stats={stats}
      />

      {/* ----------------------------------------------------- PRIORITY ISSUES */}
      <Section tone="light" className="on-light">
        <Container>
          <SectionHeading
            title={isThai ? 'ประเด็นที่เราขับเคลื่อน' : 'Priority issues we drive'}
            lede={
              isThai
                ? 'หกประเด็นที่กำหนดทิศทางโครงการของ LPN และการลงทุนของพันธมิตรที่ทำงานร่วมกัน'
                : 'Six issues that shape every LPN project and every partner investment we steward.'
            }
          />

          <div className="mt-12">
            {issues.map((i) => (
              <EditorialRow key={i.number} index={i.number} title={i.title} body={i.body} />
            ))}
          </div>
        </Container>
      </Section>

      {/* --------------------------------------------- PARTNERS + WORKER NETWORKS */}
      <Section tone="dark" className="border-y border-white/10">
        <Container>
          <SectionHeading
            eyebrow={isThai ? 'พันธมิตรของเรา' : 'Our partners'}
            tone="light"
            title={
              isThai
                ? 'ผู้ให้ทุน องค์กรประชาสังคม และพันธมิตรระหว่างประเทศ'
                : 'Funders, civil society, and international allies.'
            }
          />

          <ul className="mt-10 grid grid-cols-2 gap-px overflow-hidden border border-white/15 bg-white/10 sm:grid-cols-3 lg:grid-cols-6">
            {partners.map((p) => (
              <li
                key={p}
                className="flex h-24 items-center justify-center bg-black px-4 text-center text-xs font-black uppercase tracking-widest text-white transition-colors hover:bg-white/5 hover:text-brand-yellow"
              >
                {p}
              </li>
            ))}
          </ul>

          <div className="mt-14 grid gap-10 md:grid-cols-2">
            {networks.map((n) => (
              <article key={n.name} className="border-t border-white/20 pt-6">
                <div className="t-label text-brand-yellow">{n.tag}</div>
                <h3 className="t-h3 mt-3 text-white">{n.name}</h3>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/75">{n.body}</p>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      {/* ------------------------------------------------------------- CTA BAND */}
      <CtaBand
        heading={isThai ? 'ร่วมเป็นพันธมิตรกับ LPN' : 'Partner with LPN.'}
        body={
          isThai
            ? 'หากองค์กรของคุณมุ่งมั่นในการยุติการแสวงหาประโยชน์และเสริมสร้างสิทธิแรงงาน เราพร้อมร่วมงานกับคุณ'
            : 'If your organisation is committed to ending exploitation and strengthening labour rights, we want to collaborate.'
        }
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
      <WixIntegratedCopy slug="projects" locale={locale} />
    </>
  )
}
