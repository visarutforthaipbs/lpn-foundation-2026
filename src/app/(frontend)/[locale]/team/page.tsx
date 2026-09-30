import { WixIntegratedCopy } from '@/components/WixIntegratedCopy'
import { setRequestLocale } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'
import { routing } from '@/i18n/routing'
import { getPage, getTeam } from '@/lib/api'
import { MediaImage } from '@/components/MediaImage'
import { buildMetadata } from '@/lib/seo'
import {
  Container,
  Section,
  SectionHeading,
  PageHero,
  CtaBand,
  ButtonLink,
} from '@/components/ui'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata(props: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await props.params
  const page = await getPage('team', locale)
  return buildMetadata({
    locale,
    path: '/team',
    title: page?.meta?.title || 'Team',
    description:
      page?.meta?.description ||
      'Meet the LPN team of social workers, activists, and migrant community leaders.',
  })
}

export default async function TeamPage(props: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await props.params
  setRequestLocale(locale)
  const isThai = locale === 'th'

  const team = await getTeam(locale)

  const stats = isThai
    ? [
        { value: '20+', label: 'ปีของการเคลื่อนไหว' },
        { value: '10+', label: 'สัญชาติของแรงงานที่ทำงานด้วย' },
        { value: '1', label: 'เครือข่ายเยาวชนข้ามชาติ' },
      ]
    : [
        { value: '20+', label: 'years of organising' },
        { value: '10+', label: 'worker nationalities supported' },
        { value: '1', label: 'migrant youth network' },
      ]

  const leaders = isThai
    ? [
        {
          name: 'ปฏิมา ตั้งปรัชญากูล',
          role: 'ผู้อำนวยการ & ผู้ร่วมก่อตั้ง',
          quote: '"เป้าหมายของฉันคือการช่วยชีวิตคน"',
          body: 'หนึ่งในผู้นำการต่อสู้เพื่อยุติแรงงานทาสบนเรือประมงในเอเชียตะวันออกเฉียงใต้ ผู้นำการกู้ภัยที่ถูกบันทึกในสารคดี Ghost Fleet และได้รับการเสนอชื่อชิงรางวัลโนเบลสาขาสันติภาพปี 2017',
        },
        {
          name: 'สมพงษ์ สระแก้ว',
          role: 'ผู้ร่วมก่อตั้ง & ที่ปรึกษานโยบาย',
          quote: '"งานนี้คือชีวิตของผม"',
          body: 'นักสังคมสงเคราะห์ที่ก่อตั้ง LPN ในปี 2547 ผลักดันให้เกิดการแก้ไขพระราชบัญญัติป้องกันและปราบปรามการค้ามนุษย์ในปี 2551 และยังคงให้คำปรึกษานโยบายแรงงานข้ามชาติของไทย',
        },
        {
          name: 'สมัคร ทัพธานี',
          role: 'หัวหน้าฝ่ายคุ้มครองแรงงาน',
          quote: '"ทุกชีวิตคุ้มค่าแก่การกลับบ้าน"',
          body: 'มีบทบาทสำคัญในการกู้ภัยลูกเรือประมงกว่า 2,000 คนจากอินโดนีเซีย ผู้รับรางวัลนักปกป้องสิทธิมนุษยชนปี 2562',
        },
      ]
    : [
        {
          name: 'Patima Tungpuchayakul',
          role: 'Director & Co-founder',
          quote: '"My goal is to save lives."',
          body: 'A leading figure in ending slavery aboard fishing vessels across Southeast Asia. Led the rescues documented in "Ghost Fleet" and 2017 Nobel Peace Prize nominee.',
        },
        {
          name: 'Sompong Srakaew',
          role: 'Co-founder & Policy Advisor',
          quote: '"This work is my life."',
          body: 'A social worker who founded LPN in 2004. His evidence-driven advocacy directly shaped the 2008 amendment of Thailand’s Anti-Trafficking in Persons Act.',
        },
        {
          name: 'Samak Thuptanee',
          role: 'Head, Labour Protection Unit',
          quote: '"Every life deserves to come home."',
          body: 'Central to the rescue of 2,000+ fishers trafficked to Indonesia. Recipient of the 2019 Human Rights Defender award for anti-trafficking expertise.',
        },
      ]

  return (
    <>
      {/* ---------------------------------------------------------------- HERO */}
      <PageHero
        compact
        eyebrow={isThai ? 'ทีม LPN' : 'The LPN team'}
        title={
          isThai
            ? 'นักกิจกรรม นักสังคมสงเคราะห์ และอดีตแรงงานที่ปฏิเสธจะยอมแพ้'
            : 'Activists, social workers, and former workers who refuse to look away.'
        }
        lede={
          isThai
            ? 'เครือข่ายของเราเป็นทั้งหน่วยกู้ภัย หน่วยกฎหมาย ครู และผู้นำชุมชน รวมพลังกันเพื่อหยุดวงจรการแสวงหาประโยชน์จากแรงงาน'
            : 'Our network is at once rescue team, legal aid, teachers, and community leaders — joined in the work of breaking labour exploitation.'
        }
        stats={stats}
      />

      {/* ------------------------------------------------------------ LEADERSHIP */}
      <Section tone="light" className="on-light">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-8">
            <SectionHeading
              title={isThai ? 'ผู้นำองค์กร' : 'Leadership'}
              lede={
                isThai
                  ? 'ผู้ร่วมก่อตั้งและหัวหน้าฝ่ายภาคสนามที่กำหนดทิศทางของ LPN มากว่าสองทศวรรษ'
                  : 'Co-founders and frontline leads who have shaped LPN’s direction for two decades.'
              }
            />
            <ButtonLink href="/about" variant="ghostDark">
              {isThai ? 'อ่านเรื่องราวของเรา →' : 'Our story →'}
            </ButtonLink>
          </div>

          {/* Editorial 2-col: quote carries the person, bio carries the record. */}
          <div className="mt-12">
            {leaders.map((l) => (
              <article
                key={l.name}
                className="grid gap-x-10 gap-y-5 border-t border-black/15 py-10 md:grid-cols-2"
              >
                <div>
                  <p className="t-lede font-medium text-black/85 italic">{l.quote}</p>
                  <h3 className="t-h3 mt-6">{l.name}</h3>
                  <div className="t-label mt-2 text-black/70">{l.role}</div>
                </div>
                <p className="max-w-2xl text-base leading-relaxed text-black/75 md:pt-1.5">
                  {l.body}
                </p>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      {/* ------------------------------------------------------- FULL TEAM GRID */}
      <Section tone="dark" className="border-y border-white/10">
        <Container>
          <SectionHeading
            eyebrow={isThai ? 'สมาชิกทีม' : 'Team members'}
            tone="light"
            title={isThai ? 'หลายเสียง ภารกิจเดียวกัน' : 'Many voices. One mission.'}
          />

          {team.length === 0 ? (
            <p className="mt-10 text-white/75">
              {isThai
                ? 'ยังไม่มีข้อมูลทีมงานในระบบ — โปรดเพิ่มข้อมูลในแผงควบคุม'
                : 'No team members yet — add them from the admin panel.'}
            </p>
          ) : (
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {team.map((m) => (
                <article key={m.id} className="card p-6">
                  {m.photo && typeof m.photo !== 'number' ? (
                    <MediaImage
                      media={m.photo}
                      className="h-24 w-24 rounded-full border border-black/10 object-cover"
                    />
                  ) : (
                    <div className="flex h-24 w-24 items-center justify-center rounded-full border border-black bg-brand-yellow text-xs font-black text-black">
                      LPN
                    </div>
                  )}
                  <h3 className="mt-5 text-base font-black tracking-tight text-black">{m.name}</h3>
                  {m.role && <div className="t-label mt-1 text-black/70">{m.role}</div>}
                </article>
              ))}
            </div>
          )}
        </Container>
      </Section>

      {/* ------------------------------------------------------------- CTA BAND */}
      <CtaBand
        heading={isThai ? 'ทำงานกับเรา' : 'Work with us.'}
        body={
          isThai
            ? 'ทั้งบทบาทอาสาสมัคร นักศึกษาฝึกงาน หรือพันธมิตรองค์กร เราต้อนรับคนที่พร้อมยืนข้างแรงงาน'
            : 'Volunteer, intern, or partner — we welcome anyone ready to stand with workers.'
        }
        actions={
          <>
            <ButtonLink href="/contact" variant="solidDark">
              {isThai ? 'ติดต่อทีม' : 'Contact the team'}
            </ButtonLink>
            <ButtonLink href="/donate" variant="ghostDark">
              {isThai ? 'สนับสนุนภารกิจ' : 'Fund the mission'}
            </ButtonLink>
          </>
        }
      />
      <WixIntegratedCopy slug="team" locale={locale} />
    </>
  )
}
