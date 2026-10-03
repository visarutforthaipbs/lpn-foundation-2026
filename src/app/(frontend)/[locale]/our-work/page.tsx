import { setRequestLocale } from 'next-intl/server'
import Image from 'next/image'
import { BookOpen, LifeBuoy, Scale } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { getSiteMedia } from '@/lib/api'
import { buildMetadata } from '@/lib/seo'
import { ButtonLink, Container, Section, SectionHeading } from '@/components/ui'
import { MediaImage } from '@/components/MediaImage'

const GUIDE = 'https://www.lpnrightguide.site/'

export async function generateMetadata(props: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await props.params
  return buildMetadata({
    locale,
    path: '/our-work',
    title: locale === 'th' ? 'งานของเรา — LPN' : 'Our Work — LPN',
    description: locale === 'th'
      ? 'LPN เชื่อมการช่วยเหลือแรงงาน การเสริมความรู้ในชุมชน และการสร้างหลักฐานเพื่อเปลี่ยนระบบ'
      : 'LPN connects worker assistance, community learning, and evidence for systems change.',
  })
}

export default async function OurWorkPage(props: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await props.params
  setRequestLocale(locale)
  const th = locale === 'th'

  const mediaMap = await getSiteMedia()

  const work = th ? [
    {
      id: 'respond', number: '01', label: 'ตอบสนองและคุ้มครอง',
      icon: LifeBuoy,
      summary: 'เมื่อแรงงานหรือครอบครัวเผชิญปัญหา LPN รับฟัง ประเมินความต้องการ และประสานการช่วยเหลือที่เหมาะสม',
      examples: ['ปัญหาค่าจ้างและสภาพการทำงาน', 'เอกสารและการเดินทาง', 'สุขภาพ ความปลอดภัย และการแสวงหาประโยชน์'],
      note: 'ขอบเขตการช่วยเหลือขึ้นอยู่กับสถานการณ์และทรัพยากรที่มี โปรดติดต่อ LPN เพื่อหารือกรณีของคุณ',
      action: 'ขอความช่วยเหลือ', href: '/get-help',
      media: mediaMap.assistanceCentre,
      alt: 'การช่วยเหลือและคุ้มครองแรงงานประมงโดย LPN',
    },
    {
      id: 'learn', number: '02', label: 'เสริมความรู้และชุมชน',
      icon: BookOpen,
      summary: 'ความรู้เรื่องสิทธิและการทำงานร่วมกับเครือข่ายช่วยให้แรงงานรับรู้ทางเลือก ป้องกันความเสี่ยง และส่งต่อปัญหาได้เร็วขึ้น',
      examples: ['การอบรมแรงงานและอาสาสมัคร', 'งานด้านการศึกษาและเยาวชน', 'คู่มือรู้สิทธิ ติดกระเป๋า ภาษาไทย อังกฤษ และพม่า'],
      note: 'คู่มือให้ข้อมูลทั่วไป หากต้องการความช่วยเหลือเกี่ยวกับสถานการณ์ของคุณ ติดต่อ LPN โดยตรงได้',
      action: 'เปิดคู่มือรู้สิทธิ', href: GUIDE,
      media: mediaMap.familyHome,
      alt: 'ศูนย์การเรียนรู้เด็กข้ามชาติ LPN สมุทรสาคร',
    },
    {
      id: 'change', number: '03', label: 'เปลี่ยนระบบ',
      icon: Scale,
      summary: 'ประสบการณ์ภาคสนามและเสียงแรงงานช่วยให้ LPN มองเห็นปัญหาที่เกิดซ้ำ และสร้างหลักฐานสำหรับการทำงานกับพันธมิตรและผู้กำหนดนโยบาย',
      examples: ['งานวิจัยและรายงานภาคสนาม', 'ช่องทางรับฟังเสียงแรงงาน', 'ความร่วมมือเพื่อการคุ้มครองที่ดีขึ้น'],
      note: 'รายงานวิจัยแสดงข้อค้นพบตามขอบเขตและวิธีการของแต่ละโครงการ ไม่ใช่ผลลัพธ์ของการช่วยเหลือทุกราย',
      action: 'ดูรายงานและผลการทำงาน', href: '/impact',
      media: mediaMap.trainingCentre,
      alt: 'การขับเคลื่อนเชิงนโยบายและความร่วมมือเพื่อสิทธิแรงงาน',
    },
  ] : [
    {
      id: 'respond', number: '01', label: 'Respond and protect',
      icon: LifeBuoy,
      summary: 'When workers or families face a problem, LPN listens, considers their needs, and connects them with appropriate support.',
      examples: ['Pay and working conditions', 'Documents and migration', 'Health, safety, and exploitation'],
      note: 'The support available depends on the situation and LPN’s capacity. Contact LPN to discuss your case.',
      action: 'Get help', href: '/get-help',
      media: mediaMap.assistanceCentre,
      alt: 'LPN fisher assistance and casework',
    },
    {
      id: 'learn', number: '02', label: 'Learn and strengthen communities',
      icon: BookOpen,
      summary: 'Rights knowledge and community networks help workers understand options, prevent risks, and raise problems earlier.',
      examples: ['Worker and volunteer training', 'Education and youth support', 'Thai, English, and Burmese Rights Guide'],
      note: 'The guide provides general information. For help with your own situation, you can contact LPN directly.',
      action: 'Open the Rights Guide', href: GUIDE,
      media: mediaMap.familyHome,
      alt: 'LPN migrant learning center in Samut Sakhon',
    },
    {
      id: 'change', number: '03', label: 'Change systems',
      icon: Scale,
      summary: 'Field experience and worker voice reveal recurring barriers and create evidence for work with partners and decision makers.',
      examples: ['Field research and reports', 'Worker-voice channels', 'Partnerships for better protection'],
      note: 'Each research report has its own scope and method. Its findings are not outcomes of every individual assistance case.',
      action: 'Explore impact and reports', href: '/impact',
      media: mediaMap.trainingCentre,
      alt: 'Policy advocacy and multi-stakeholder partnership',
    },
  ]

  return <>
    <section className="relative overflow-hidden bg-black text-white">
      {/* Authentic field photography backdrop */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/fisher-protection.jpg"
          alt={th ? 'การปฏิบัติงานคุ้มครองแรงงานประมง LPN' : 'LPN maritime worker protection'}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-30 brightness-90 contrast-105"
        />
        <div className="absolute inset-0 bg-linear-to-r from-black via-black/85 to-black/60 pointer-events-none" />
        <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-black/40 pointer-events-none" />
      </div>

      <Container className="relative z-10 py-16 md:py-24">
        <p className="eyebrow text-brand-yellow">{th ? 'งานของเรา' : 'Our work'}</p>
        <h1 className="t-display mt-6 max-w-5xl text-white">{th ? 'ช่วยเหลือวันนี้ สร้างความปลอดภัยในวันหน้า' : 'Protection today. Safer systems tomorrow.'}</h1>
        <p className="t-lede mt-7 max-w-3xl text-white/80">{th
          ? 'งานช่วยเหลือ การเรียนรู้กับชุมชน และการสร้างหลักฐานเชื่อมกันผ่านความต้องการและเสียงของแรงงานข้ามชาติ'
          : 'Direct assistance, community learning, and evidence-building are connected by the needs and voices of migrant workers.'}</p>
        <div className="mt-9"><ButtonLink href="/get-help" variant="primary">{th ? 'ต้องการความช่วยเหลือ?' : 'Need help?'}</ButtonLink></div>
      </Container>
    </section>

    {work.map((item, i) => <Section key={item.id} id={item.id} tone={i === 1 ? 'paper' : 'light'}><Container>
      <div className="grid gap-9 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-start">
        <div>
          <p className="t-label text-black/70">{item.number} / {th ? 'งานหลัก' : 'Workstream'}</p>
          <div className="mt-3 flex items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-black text-brand-yellow">
              <item.icon className="h-6 w-6" aria-hidden="true" />
            </div>
            <h2 className="t-h2">{item.label}</h2>
          </div>
          <p className="t-lede mt-5 text-black/80">{item.summary}</p>
          {item.id === 'learn' && (
            <div className="mt-6 flex items-center gap-4 rounded-xl border border-black/10 bg-white p-4 shadow-xs">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-black/10 bg-white p-1.5 shadow-2xs">
                <Image
                  src="/logos/right-guide/favicon-rightguild-new.svg"
                  alt={th ? 'คู่มือรู้สิทธิ ติดกระเป๋า' : 'LPN Rights Guide'}
                  width={48}
                  height={48}
                  unoptimized
                  className="h-12 w-12 object-contain"
                />
              </div>
              <div>
                <h4 className="font-bold text-black text-sm">{th ? 'คู่มือรู้สิทธิ ติดกระเป๋า' : 'LPN Rights Guide Companion'}</h4>
                <p className="text-xs text-black/70 mt-0.5">{th ? 'สถานการณ์จำลอง 8 หมวด และสิทธิ 12 เรื่อง (ไทย / อังกฤษ / พม่า)' : '8 situation paths & 12 rights topics (TH / EN / MY)'}</p>
              </div>
            </div>
          )}
          <div className="mt-8"><ButtonLink href={item.href} variant="solidDark">{item.action}</ButtonLink></div>
        </div>
        <div className="flex flex-col border border-black/15 bg-white shadow-xs">
          {item.media && (
            <div className="relative aspect-16/10 w-full overflow-hidden bg-black/5 border-b border-black/10">
              <MediaImage
                media={item.media}
                alt={item.alt}
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="h-full w-full object-cover"
              />
            </div>
          )}
          <div className="border-l-4 border-brand-yellow p-6 sm:p-7">
            <h3 className="t-h3">{th ? 'สิ่งที่ทำ' : 'What this includes'}</h3>
            <ul className="mt-5 space-y-3 text-sm leading-relaxed text-black/80">{item.examples.map((e) => <li key={e} className="border-b border-black/10 pb-3">{e}</li>)}</ul>
            <p className="mt-6 text-sm leading-relaxed text-black/70">{item.note}</p>
          </div>
        </div>
      </div>
    </Container></Section>)}

    <Section tone="dark"><Container>
      <SectionHeading eyebrow={th ? 'ดูรายละเอียดเพิ่มเติม' : 'Explore further'} title={th ? 'เรื่องราวและโครงการของ LPN' : 'LPN programmes and history'} tone="light" lede={th ? 'รายละเอียดบริการ โครงการ และความร่วมมือในอดีตยังคงอ่านได้ในเว็บไซต์ใหม่' : 'The detailed services, projects, and past partnerships remain available on the new site.'} />
      <div className="mt-8 flex flex-wrap gap-4">
        <Link href="/services" className="link-mark text-white">{th ? 'บริการและแนวทางทำงาน' : 'Services and approach'} →</Link>
        <Link href="/projects" className="link-mark text-white">{th ? 'โครงการและความร่วมมือ' : 'Projects and partnerships'} →</Link>
        <Link href="/blog" className="link-mark text-white">{th ? 'ข่าวล่าสุด' : 'Recent updates'} →</Link>
      </div>
    </Container></Section>
  </>
}
