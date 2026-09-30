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
} from '@/components/ui'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata(props: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await props.params
  const page = await getPage('about', locale)
  return buildMetadata({
    locale,
    path: '/about',
    title: page?.meta?.title || 'About LPN',
    description:
      page?.meta?.description ||
      'Why LPN focuses on migrant worker rights and anti-trafficking work in Thailand.',
  })
}

export default async function AboutPage(props: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await props.params
  setRequestLocale(locale)
  const isThai = locale === 'th'

  const pillars = isThai
    ? [
        {
          number: '01',
          title: 'ภารกิจ',
          body: 'ยุติการแสวงหาประโยชน์ การเลือกปฏิบัติ และความเหลื่อมล้ำเชิงโครงสร้างที่กระทำต่อแรงงานข้ามชาติในประเทศไทย',
        },
        {
          number: '02',
          title: 'แนวทาง',
          body: 'รวมการช่วยเหลือเร่งด่วนเข้ากับการศึกษาเรื่องสิทธิระยะยาว และการป้องกันโดยฐานชุมชน เพื่อหยุดการตกเป็นเหยื่อซ้ำซาก',
        },
        {
          number: '03',
          title: 'ทฤษฎีการเปลี่ยนแปลง',
          body: 'เชื่อมการช่วยเหลือผู้รอดชีวิต กระบวนการกฎหมาย หลักฐานเชิงนโยบาย และการขับเคลื่อนสาธารณะ ให้นำไปสู่การปฏิรูปเชิงระบบที่ยั่งยืน',
        },
      ]
    : [
        {
          number: '01',
          title: 'Mission',
          body: 'End exploitation, discrimination, and structural inequality against migrant workers in Thailand.',
        },
        {
          number: '02',
          title: 'Approach',
          body: 'Combine urgent rescue with long-term rights education and community-based prevention to break the cycle of abuse.',
        },
        {
          number: '03',
          title: 'Theory of change',
          body: 'Link survivor assistance, legal support, evidence gathering, and policy advocacy so immediate protection drives durable systemic reform.',
        },
      ]

  const stats = isThai
    ? [
        { value: '5,000+', label: 'แรงงานไทย-ข้ามชาติที่เราช่วยเหลือ' },
        { value: '2,000+', label: 'ชาวประมงที่ได้รับการช่วยเหลือจากอินโดนีเซีย' },
        { value: '20+', label: 'ปีของการเคลื่อนไหวเพื่อสิทธิแรงงาน' },
      ]
    : [
        { value: '5,000+', label: 'Thai & migrant workers assisted' },
        { value: '2,000+', label: 'fishers rescued from Indonesia' },
        { value: '20+', label: 'years of labour-rights organising' },
      ]

  const leaders = isThai
    ? [
        {
          name: 'Patima Tungpuchayakul',
          role: 'ผู้อำนวยการ และผู้ร่วมก่อตั้ง',
          quote: '"เป้าหมายของฉันคือการช่วยชีวิตคน"',
          body: 'หนึ่งในผู้นำการต่อสู้เพื่อยุติการบังคับใช้แรงงานบนเรือประมงในเอเชียตะวันออกเฉียงใต้ ผู้ได้รับการเสนอชื่อชิงรางวัลโนเบลสาขาสันติภาพในปี 2017 และเป็นแกนหลักในการกู้ภัยชาวประมงที่ถูกค้ามนุษย์ไปยังอินโดนีเซีย — เรื่องราวที่ถูกถ่ายทอดในสารคดี Ghost Fleet',
        },
        {
          name: 'Sompong Srakaew',
          role: 'ผู้ร่วมก่อตั้ง และที่ปรึกษานโยบาย',
          quote: '"งานนี้คือชีวิตของผม"',
          body: 'นักสังคมสงเคราะห์ที่ก่อตั้ง LPN ในปี 2547 หลังจากนำการบุกค้นช่วยเหลือแรงงานเมียนมาจากโรงงานแปรรูปกุ้ง ผลักดันให้เกิดการแก้ไขพระราชบัญญัติป้องกันและปราบปรามการค้ามนุษย์ในปี 2551 และยังคงให้คำปรึกษานโยบายเพื่อยุติการเป็นทาสยุคใหม่',
        },
      ]
    : [
        {
          name: 'Patima Tungpuchayakul',
          role: 'Director & Co-founder',
          quote: '"My goal is to save lives."',
          body: 'A leading figure in the fight to end slavery aboard fishing vessels across Southeast Asia. 2017 Nobel Peace Prize nominee. She led LPN’s rescue operations — work documented in the award-winning film "Ghost Fleet" — freeing over 2,000 fishers trafficked to Indonesia.',
        },
        {
          name: 'Sompong Srakaew',
          role: 'Co-founder & Policy Advisor',
          quote: '"This work is my life."',
          body: 'A social worker who founded LPN in 2004 after leading a raid that freed 66 Myanmar workers from a shrimp-processing shed. His evidence work drove the 2008 amendment of the Anti-Trafficking in Persons Act and continues to shape Thai labour policy today.',
        },
      ]

  const awards = isThai
    ? [
        '2564 — ผู้ชนะรางวัล Societal Leader, ICLIF Leadership Energy Awards',
        '2561 — Jairo Mora Sandoval Award, The Society for Conservation Biology',
        '2561 — Seafood Champion, SeaWeb',
        '2560 — ผู้ได้รับการเสนอชื่อรางวัลโนเบลสาขาสันติภาพ',
        '2559 — บทความเกี่ยวกับงานของ LPN ("Seafood from Slaves", AP) ได้รางวัลพูลิตเซอร์',
        '2559 — Honorable Mention, Human Rights Watch Asia',
      ]
    : [
        '2021 — Societal Leader Award, ICLIF Leadership Energy Awards',
        '2018 — Jairo Mora Sandoval Award, Society for Conservation Biology',
        '2018 — Seafood Champion, SeaWeb (Ocean Foundation)',
        '2017 — Nobel Peace Prize Nominee',
        '2016 — Pulitzer Prize feature on LPN’s work ("Seafood from Slaves", AP)',
        '2016 — Honorable Mention, Human Rights Watch Asia',
      ]

  return (
    <>
      {/* ---------------------------------------------------------------- HERO */}
      <PageHero
        compact
        eyebrow={isThai ? 'เกี่ยวกับ LPN' : 'About LPN'}
        title={
          isThai
            ? 'ยืนอยู่กับแรงงานข้ามชาติมากว่า 15 ปี — ตั้งแต่ในทะเลจนถึงห้องประชุมเชิงนโยบาย'
            : 'For 15+ years, standing with migrant workers — from the open sea to the policy table.'
        }
        lede={
          isThai
            ? 'LPN ก่อตั้งขึ้นเพื่อปรับปรุงคุณภาพชีวิตของแรงงานข้ามชาติในประเทศไทย โดยเผชิญหน้ากับการแสวงหาประโยชน์ การเลือกปฏิบัติ และความเหลื่อมล้ำเชิงโครงสร้าง'
            : 'LPN was founded to improve the lives of migrant workers in Thailand by confronting exploitation, discrimination, and structural inequality.'
        }
        stats={stats}
      />

      {/* ------------------------------------------------------ WHY THIS WORK */}
      <Section tone="light" className="on-light">
        <Container>
          <SectionHeading
            title={isThai ? 'ทำไมงานนี้จึงสำคัญ' : 'Why this work matters'}
            lede={
              isThai
                ? 'แรงงานข้ามชาติเป็นกลุ่มที่เปราะบางที่สุดต่อการละเมิด การค้ามนุษย์ และการบังคับใช้แรงงาน เราจึงทำงานทั้งช่วยเหลือเร่งด่วนและเปลี่ยนระบบไปพร้อมกัน'
                : 'Migrant workers are among the most vulnerable to abuse, trafficking, and forced labour. We pair urgent rescue with long-term systemic change.'
            }
          />
          <div className="mt-12">
            {pillars.map((p) => (
              <EditorialRow key={p.number} index={p.number} title={p.title} body={p.body} />
            ))}
          </div>
        </Container>
      </Section>

      {/* --------------------------------------------------------- LEADERSHIP */}
      <Section tone="dark" className="border-y border-white/10">
        <Container>
          <SectionHeading
            tone="light"
            eyebrow={isThai ? 'ผู้นำองค์กร' : 'Leadership'}
            title={isThai ? 'นักสิทธิที่ทำงานข้างเดียวกับแรงงาน' : 'Activists who walk beside workers.'}
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {leaders.map((l) => (
              <article key={l.name} className="glass-dark relative rounded p-8">
                <span className="absolute top-0 left-0 h-1.5 w-12 bg-brand-yellow" aria-hidden="true" />
                <p className="text-lg font-bold text-brand-yellow italic leading-snug md:text-xl">
                  {l.quote}
                </p>
                <h3 className="t-h3 mt-6 text-white">{l.name}</h3>
                <div className="t-label mt-1.5 text-white/55">{l.role}</div>
                <p className="mt-5 text-sm leading-relaxed text-white/75">{l.body}</p>
              </article>
            ))}
          </div>
          <div className="mt-10">
            <ButtonLink href="/team" variant="ghostLight">
              {isThai ? 'พบทีมงานทั้งหมด' : 'Meet the full team'} →
            </ButtonLink>
          </div>
        </Container>
      </Section>

      {/* ------------------------------------------------------------- AWARDS */}
      <Section tone="light" className="on-light">
        <Container>
          <div className="grid gap-12 md:grid-cols-[1fr_2fr] md:items-start">
            <div>
              <span className="t-label inline-block bg-brand-yellow px-2 py-1 text-black">
                {isThai ? 'การยอมรับ' : 'Recognition'}
              </span>
              <h2 className="t-h2 mt-5">
                {isThai ? 'รางวัลและการยอมรับ' : 'Awards & recognition'}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-black/70">
                {isThai
                  ? 'รางวัลเหล่านี้สะท้อนถึงผู้รอดชีวิต พันธมิตร และชุมชนแรงงานที่ทำงานเคียงข้างกับเรา'
                  : 'These awards belong to the survivors, partners, and worker communities who built this movement with us.'}
              </p>
            </div>
            <ul className="divide-y divide-black/10 border-y border-black/10">
              {awards.map((a) => (
                <li key={a} className="flex items-baseline gap-4 py-4">
                  <span className="mt-2 inline-block h-1.5 w-3 shrink-0 bg-brand-yellow" aria-hidden="true" />
                  <span className="text-sm leading-relaxed text-black/85">{a}</span>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      {/* ---------------------------------------------------------------- CTA */}
      <CtaBand
        heading={isThai ? 'ร่วมขับเคลื่อนกับเรา' : 'Stand with the movement.'}
        body={
          isThai
            ? 'การสนับสนุนของคุณคือเชื้อเพลิงของการช่วยเหลือ การคุ้มครองทางกฎหมาย และเครือข่ายแรงงานที่นำไปสู่การเปลี่ยนแปลงระยะยาว'
            : 'Your support fuels rescue operations, legal protection, and worker-led networks that drive lasting change.'
        }
        actions={
          <>
            <ButtonLink href="/donate" variant="solidDark">
              {isThai ? 'บริจาค' : 'Donate'}
            </ButtonLink>
            <ButtonLink href="/services" variant="ghostDark">
              {isThai ? 'ดูบริการของเรา' : 'See our services'}
            </ButtonLink>
          </>
        }
      />
      <WixIntegratedCopy slug="about" locale={locale} />
    </>
  )
}
