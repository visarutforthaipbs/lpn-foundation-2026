import { setRequestLocale } from 'next-intl/server'
import Image from 'next/image'
import { ClipboardText, ShieldCheck, Translate, TrendUp, UsersThree } from '@phosphor-icons/react/ssr'
import type { Locale } from '@/i18n/routing'
import { routing } from '@/i18n/routing'
import { getPage, getTeam, getSiteMedia } from '@/lib/api'
import { TeamCard } from '@/components/TeamCard'
import { HistoryTimeline, type Milestone } from '@/components/HistoryTimeline'

// Shown in the Leadership section with their bios, so the Team grid skips them (names in either locale).
const LEADER_NAMES = new Set(['ปฏิมา ตั้งปรัชญากูล', 'Patima Tungpuchayakul', 'สมพงค์ สระแก้ว', 'Sompong Srakaew'])
import { buildMetadata } from '@/lib/seo'
import { MediaImage } from '@/components/MediaImage'
import { ButtonLink, Container, Section, SectionHeading } from '@/components/ui'
import { tx } from '@/i18n/tx'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata(props: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await props.params
  const page = await getPage('about', locale)
  return buildMetadata({
    locale,
    path: '/about',
    title: page?.meta?.title || (tx(locale, 'เกี่ยวกับเรา — LPN', 'About — LPN')),
    description:
      page?.meta?.description ||
      (tx(locale, 'LPN คือองค์กรแนวหน้าด้านสิทธิแรงงานข้ามชาติในประเทศไทย ช่วยเหลือให้คนเข้าถึงการคุ้มครองวันนี้ และสร้างระบบที่ปลอดภัยขึ้นในวันหน้า', 'LPN is a frontline migrant-rights organisation in Thailand that helps people access protection today and builds safer systems for tomorrow.')),
  })
}

export default async function AboutPage(props: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await props.params
  setRequestLocale(locale)
  const [team, mediaMap] = await Promise.all([
    getTeam(locale),
    getSiteMedia(),
  ])


  const values = tx(locale, [
    { icon: ShieldCheck, title: 'ความปลอดภัยก่อนสิ่งอื่น', body: 'ช่องทางติดต่อที่ตรวจสอบแล้ว ความคาดหวังที่ตรงตามจริง และไม่บังคับให้กรอกแบบฟอร์มหรือเปิดเผยข้อมูลก่อนได้รับความช่วยเหลือ' },
    { icon: UsersThree, title: 'ผู้คนที่มีเสียงและทางเลือก', body: 'นำเสนอแรงงานในฐานะผู้มีศักยภาพและเจตจำนง เรื่องราวต้องผ่านความยินยอม และไม่ใช้ภาพความทุกข์ทรมานเป็นภาพหลักขององค์กร' },
    { icon: ClipboardText, title: 'ข้อมูลที่มีบริบท', body: 'ตัวเลขผลการทำงานระบุช่วงเวลา นิยาม และแหล่งที่มา ความสำเร็จในอดีตระบุปีอย่างชัดเจน งานวิจัยไม่ถูกนำเสนอเป็นผลลัพธ์ที่ LPN สร้าง' },
    { icon: Translate, title: 'ภาษาท้องถิ่นคือส่วนหนึ่งของบริการ', body: 'หน้าเว็บไทยและอังกฤษสมบูรณ์ คำแนะนำสำคัญในภาษาพม่า เขมร และลาว ต้องผ่านการตรวจโดยเจ้าของภาษา' },
    { icon: TrendUp, title: 'หนึ่งทฤษฎีการเปลี่ยนแปลงที่เชื่อมกัน', body: 'งานช่วยเหลือโดยตรง ความรู้ชุมชน และการเปลี่ยนแปลงเชิงระบบ เสริมกัน โดยไม่อ้างว่าทุกกรณีนำไปสู่การเปลี่ยนแปลงนโยบาย' },
  ], [
    { icon: ShieldCheck, title: 'Safety before everything', body: 'Verified contact routes, realistic expectations, and no form, account, or data disclosure required before someone can get help.' },
    { icon: UsersThree, title: 'People with voices and choices', body: 'Workers are shown with agency. Stories are consented, and distress imagery is not our default identity.' },
    { icon: ClipboardText, title: 'Claims with context', body: 'Outcome figures carry a period, definition, and source. Historic achievements stay clearly dated, and research is not presented as LPN-delivered outcomes.' },
    { icon: Translate, title: 'Local language is part of service', body: 'Thai and English pages are complete, and core help instructions in Burmese, Khmer, and Lao require native-speaker review before publication.' },
    { icon: TrendUp, title: 'One connected theory of change', body: 'Direct response, community knowledge, and system change reinforce each other — without implying every case creates policy change.' },
  ])

  // Dated history — PRD: historical accomplishments remain clearly dated.
  const timeline: Milestone[] = tx(locale, [
    { from: 2004, label: '2547', kind: 'founding', title: 'ก่อตั้ง LPN', body: 'ก่อตั้งเครือข่ายส่งเสริมคุณภาพชีวิตแรงงาน (LPN) โดยปฏิมา ตั้งปรัชญากูล และสมพงค์ สระแก้ว เพื่อเรียกร้องความเป็นธรรมให้แรงงานข้ามชาติในไทย' },
    { from: 2008, label: '2551', kind: 'law', title: 'แก้กฎหมายค้ามนุษย์', body: 'หลักฐานจากการทำงานร่วมกับแรงงาน มีส่วนผลักดันการแก้ไขพระราชบัญญัติป้องกันและปราบปรามการค้ามนุษย์ เพิ่มโทษผู้กระทำผิดและนายหน้า' },
    { from: 2014, to: 2016, label: '2557–2559', kind: 'rescue', title: 'ช่วยลูกเรือกว่า 2,000 คน', body: 'ปฏิบัติการช่วยเหลือลูกเรือประมงที่ถูกทิ้งบนเกาะในอินโดนีเซีย ร่วมกับสื่อมวลชน IOM และรัฐบาลอินโดนีเซีย — ช่วยเหลือลูกเรือกว่า 2,000 คน' },
    { from: 2017, label: '2560', kind: 'recognition', title: 'เสนอชื่อชิงรางวัลโนเบล', body: 'ปฏิมา ตั้งปรัชญากูล ได้รับการเสนอชื่อชิงรางวัลโนเบลสาขาสันติภาพ จากการทำงานเพื่อยุติแรงงานทาสในอุตสาหกรรมประมง' },
    { from: 2019, label: '2562', kind: 'film', title: 'สารคดี Ghost Fleet', body: 'สารคดี Ghost Fleet ออกฉาย บันทึกภารกิจช่วยเหลือลูกเรือประมงของ LPN' },
    { from: 2026, label: 'ปัจจุบัน', kind: 'today', title: 'งานครบทุกด้าน', body: 'งานของ LPN ครอบคลุมการช่วยเหลือรายกรณี การศึกษาและเยาวชน เสียงแรงงาน งานวิจัย และการผลักดันนโยบาย — โดยมีสิทธิของแรงงานข้ามชาติเป็นศูนย์กลาง' },
  ], [
    { from: 2004, label: '2004', kind: 'founding', title: 'LPN is founded', body: 'The Labour Rights Promotion Network (LPN) is founded by Patima Tungpuchayakul and Sompong Srakaew to seek justice for migrant workers in Thailand.' },
    { from: 2008, label: '2008', kind: 'law', title: 'Anti-trafficking law amended', body: 'Evidence from LPN casework contributes to the amendment of Thailand’s Anti-Trafficking in Persons Act, increasing penalties for traffickers and brokers.' },
    { from: 2014, to: 2016, label: '2014–2016', kind: 'rescue', title: '2,000+ fishers rescued', body: 'Rescue operations for fishers stranded on Indonesian islands, with journalists, IOM, and the Indonesian government — more than 2,000 fishers brought to safety.' },
    { from: 2017, label: '2017', kind: 'recognition', title: 'Nobel Peace Prize nomination', body: 'Patima Tungpuchayakul is nominated for the Nobel Peace Prize for work ending slavery in the fishing industry.' },
    { from: 2019, label: '2019', kind: 'film', title: '“Ghost Fleet” released', body: 'The documentary “Ghost Fleet” is released, recording LPN’s fisher rescue missions.' },
    { from: 2026, label: 'Today', kind: 'today', title: 'The whole picture', body: 'LPN’s work spans direct casework, education and youth, worker voice, research, and advocacy — with migrant workers’ rights at the centre.' },
  ])
  const historyStats = tx(locale, [
    { value: `${2026 - 2004} ปี`, label: 'ทำงานเคียงข้างแรงงานข้ามชาติ ตั้งแต่ 2547' },
    { value: '2,000+', label: 'ลูกเรือประมงได้รับการช่วยเหลือ 2557–2559' },
    { value: '2560', label: 'ผู้อำนวยการได้รับการเสนอชื่อชิงรางวัลโนเบลสันติภาพ' },
  ], [
    { value: `${2026 - 2004} years`, label: 'alongside migrant workers, since 2004' },
    { value: '2,000+', label: 'fishers rescued, 2014–2016' },
    { value: '2017', label: 'Nobel Peace Prize nomination for our director' },
  ])

  const leaders = tx(locale, [
    {
      name: 'ปฏิมา ตั้งปรัชญากูล',
      role: 'ผู้ร่วมก่อตั้งและผู้อำนวยการ',
      body: 'ผู้ได้รับการเสนอชื่อชิงรางวัลโนเบลสาขาสันติภาพปี 2017 นำงานช่วยเหลือและงานรณรงค์ด้านสิทธิแรงงานประมงในระดับภูมิภาค — เรื่องราวของเธอถูกถ่ายทอดในภาพยนตร์สารคดี Ghost Fleet',
      media: mediaMap.patimaPortrait,
    },
    {
      name: 'สมพงค์ สระแก้ว',
      role: 'ผู้ร่วมก่อตั้งและที่ปรึกษานโยบาย',
      body: 'นักสังคมสงเคราะห์ผู้ก่อตั้ง LPN ในปี 2547 งานหลักฐานของเขาช่วยผลักดันการแก้ไขกฎหมายต่อต้านการค้ามนุษย์ และยังคงทำงานด้านนโยบายแรงงานและช่วยเหลือแรงงานข้ามชาติ',
      media: mediaMap.sompongPortrait,
    },
  ], [
    {
      name: 'Patima Tungpuchayakul',
      role: 'Co-founder & Director',
      body: '2017 Nobel Peace Prize nominee. Leads LPN’s assistance work and regional advocacy for fishers’ rights — featured in the award-winning documentary film Ghost Fleet.',
      media: mediaMap.patimaPortrait,
    },
    {
      name: 'Sompong Srakaew',
      role: 'Co-founder & Policy advisor',
      body: 'The social worker who founded LPN in 2004. His evidence-driven advocacy shaped Thailand’s 2008 anti-trafficking law amendment and continues in labour policy.',
      media: mediaMap.sompongPortrait,
    },
  ])

  const networks = [
    {
      abbr: 'FLG',
      name: tx(locale, 'กลุ่มผู้นำแรงงานประมง', 'Fishermen Leaders Group'),
      sub: tx(locale, 'เฝ้าระวังและช่วยเหลือแรงงานประมง', 'Maritime worker leadership'),
      logo: '/logos/subbrands/flg-white.png',
    },
    {
      abbr: 'MLN',
      name: tx(locale, 'เครือข่ายผู้นำแรงงานข้ามชาติ', 'Migrant Leaders Network'),
      sub: tx(locale, 'เครือข่ายประสานงานระหว่างกลุ่ม', 'Cross-sector worker leadership'),
      logo: '/logos/subbrands/mln-white.png',
    },
    {
      abbr: 'MMLG',
      name: tx(locale, 'กลุ่มผู้นำแรงงานเมียนมา', 'Myanmar Migrant Leaders Group'),
      sub: tx(locale, 'สื่อสารและดูแลชุมชนเมียนมา', 'Community solidarity & rights'),
      logo: '/logos/subbrands/mmlg-white.png',
    },
    {
      abbr: 'CMLG',
      name: tx(locale, 'กลุ่มผู้นำแรงงานกัมพูชา', 'Cambodian Migrant Leaders Group'),
      sub: tx(locale, 'การประสานความช่วยเหลือในชุมชน', 'Community outreach & assistance'),
      logo: '/logos/subbrands/cmlg-white.png',
    },
    {
      abbr: 'LMLG',
      name: tx(locale, 'กลุ่มผู้นำแรงงานลาว', 'Lao Migrant Leaders Group'),
      sub: tx(locale, 'การคุ้มครองและสวัสดิการแรงงาน', 'Workplace welfare & mutual aid'),
      logo: '/logos/subbrands/lmlg-white.png',
    },
  ]

  return (
    <>
      {/* ---------------------------------------------------------------- HERO */}
      <section className="relative overflow-hidden bg-black text-white">
        {/* Authentic community field photography */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/community-outreach.jpg"
            alt={tx(locale, 'ชุมชนแรงงานข้ามชาติและทีมงาน LPN', 'Migrant community outreach and LPN team')}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-70"
          />
          <div className="absolute inset-0 bg-linear-to-r from-black via-black/75 to-black/10 pointer-events-none" />
          <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-black/40 pointer-events-none" />
        </div>

        <div className="container-page relative z-10 py-20 md:py-28">
          <p className="eyebrow text-white/70">{tx(locale, 'เกี่ยวกับ LPN', 'About LPN')}</p>
          <h1 className="t-display mt-7 max-w-4xl text-white">
            {tx(locale, 'องค์กรแนวหน้าด้านสิทธิแรงงานข้ามชาติในประเทศไทย', 'A frontline migrant-rights organisation in Thailand.')}
          </h1>
          <p className="t-lede mt-8 max-w-2xl text-white/85">
            {tx(locale, 'เราช่วยให้แรงงานและครอบครัวเข้าถึงการคุ้มครองในวันนี้ และสร้างระบบที่ปลอดภัยขึ้นในวันหน้า — ด้วยงานช่วยเหลือรายกรณีที่ไว้ใจได้ ควบคู่กับการศึกษา เสียงแรงงาน งานวิจัย และการผลักดันนโยบาย', 'We help workers and families access protection today and build safer systems for tomorrow — combining trusted, multilingual case support with education, worker voice, field research, and advocacy.')}
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href="/get-help" variant="primary">{tx(locale, 'ขอความช่วยเหลือ', 'Get help')}</ButtonLink>
            <ButtonLink href="/donate" variant="ghostLight">{tx(locale, 'ร่วมสนับสนุน', 'Support the work')}</ButtonLink>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <Section tone="paper"><Container>
        <SectionHeading
          eyebrow={tx(locale, 'หลักการของเรา', 'Our principles')}
          title={tx(locale, 'ความมั่นคง ความเป็นมนุษย์ และความรับผิดชอบ', 'Steady, humane, and competent.')}
        />
        <div className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((v) => (
            <div key={v.title} className="flex gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-black text-brand-yellow">
                <v.icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <h3 className="t-h3">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-black/75">{v.body}</p>
              </div>
            </div>
          ))}
        </div>
      </Container></Section>

      {/* HISTORY — DATED */}
      <Section tone="dark"><Container>
        <SectionHeading
          tone="light"
          eyebrow={tx(locale, 'เส้นทางที่ผ่านมา', 'Our history, in context')}
          title={tx(locale, 'เหตุการณ์สำคัญระบุช่วงเวลา', 'Key moments, clearly dated.')}
          lede={tx(locale, 'ความกล้าหาญในการช่วยเหลือกลางทะเลเป็นส่วนสำคัญของประวัติศาสตร์เรา — และเป็นเพียงส่วนหนึ่งของงานทั้งหมด', 'Courageous rescues at sea are an important part of our history — and one part of the whole.')}
        />
        <HistoryTimeline items={timeline} start={2004} end={2026} stats={historyStats} todayLabel={tx(locale, 'ปัจจุบัน', 'Today')} yearOffset={tx(locale, 543, 0)} />
        <p className="mt-8 max-w-3xl border-l border-white/25 pl-4 text-xs leading-relaxed text-white/60 italic">
          {tx(locale, '* เครือข่ายส่งเสริมคุณภาพชีวิตแรงงาน เปลี่ยนชื่อเป็น มูลนิธิเครือข่ายส่งเสริมคุณภาพชีวิตแรงงาน (Labour Protection Network) เพื่อสะท้อนชื่อย่อ LPN ที่เป็นที่รู้จัก', '* The Labour Rights Promotion Network was renamed to the Labour Protection Network to better reflect its well-known acronym, LPN.')}
        </p>
      </Container></Section>

      {/* LEADERSHIP */}
      <Section tone="light"><Container>
        <SectionHeading
          eyebrow={tx(locale, 'ผู้นำองค์กร', 'Leadership')}
          title={tx(locale, 'คนที่ทำงานเคียงข้างแรงงาน', 'People who work alongside workers.')}
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {leaders.map((l) => (
            <article key={l.name} className="grid overflow-hidden rounded-xl border border-black/10 bg-paper sm:grid-cols-[minmax(0,14rem)_1fr]">
              <div className="relative aspect-[3/4] w-full bg-brand-yellow">
                {l.media && (
                  <MediaImage media={l.media} alt={l.name} fill sizes="(min-width: 640px) 14rem, 100vw" className="object-cover object-top" />
                )}
              </div>
              <div className="flex flex-col p-6">
                <h3 className="t-h3">{l.name}</h3>
                <div className="t-label mt-1.5 font-semibold text-black/70">{l.role}</div>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-black/75">{l.body}</p>
              </div>
            </article>
          ))}
        </div>
      </Container></Section>

      {/* TEAM */}
      <Section tone="paper"><Container>
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow={tx(locale, 'ทีมงาน', 'The team')}
            title={tx(locale, 'นักกิจกรรม นักสังคมสงเคราะห์ และอดีตแรงงาน', 'Activists, social workers, and former workers.')}
          />
          <ButtonLink href="/team" variant="ghostDark">{tx(locale, 'ดูทีมงานทั้งหมด', 'Meet the full team')} →</ButtonLink>
        </div>
        {team.length > 0 && (
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {team.filter((m) => m.photo && typeof m.photo !== 'number' && !LEADER_NAMES.has(m.name)).map((m) => (
              <TeamCard key={m.id} member={m} />
            ))}
          </div>
        )}
      </Container></Section>

      {/* WORKER-LED NETWORKS */}
      <Section tone="dark" className="border-t border-white/10">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow text-white/70">
              {tx(locale, 'เครือข่ายแรงงานร่วมขับเคลื่อน', 'Worker-Led Community Networks')}
            </p>
            <h2 className="t-h2 mt-4 text-white">
              {tx(locale, 'องค์กรผู้นำแรงงานที่เป็นพลังหลักในชุมชน', 'Migrant Leadership Groups Working Alongside LPN')}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-white/80 sm:text-base">
              {tx(locale, 'LPN ทำงานร่วมกับ 5 เครือข่ายผู้นำแรงงานข้ามชาติ เพื่อส่งเสริมการพึ่งพาตนเอง การเฝ้าระวัง และการช่วยเหลือซึ่งกันและกัน', 'LPN works alongside five organized migrant leadership groups to build collective voice, monitor rights, and provide community mutual aid.')}
            </p>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {networks.map((net) => (
              <div
                key={net.abbr}
                className="flex flex-col items-center justify-center border border-white/15 bg-white/5 p-6 text-center transition-all hover:border-current/50 hover:bg-white/10"
              >
                <div className="relative h-14 w-24">
                  <Image
                    src={net.logo}
                    alt={`${net.abbr} - ${net.name}`}
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="mt-4 font-mono text-xs font-bold tracking-wider text-brand-yellow">
                  {net.abbr}
                </span>
                <span className="mt-1 text-xs font-semibold text-white">
                  {net.name}
                </span>
                <span className="mt-1 text-xs text-white/60">
                  {net.sub}
                </span>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA — dual path */}
      <Section tone="dark"><Container className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
        <SectionHeading
          tone="light"
          eyebrow={tx(locale, 'ก้าวต่อไป', 'Next step')}
          title={tx(locale, 'ต้องการความช่วยเหลือ หรืออยากสนับสนุนงานของเรา?', 'Need help, or want to support the work?')}
          lede={tx(locale, 'สองเส้นทางมีความสำคัญเท่าเทียมกัน — เลือกเส้นทางที่ตรงกับคุณ', 'Two equally important paths — choose the one that fits you.')}
        />
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/get-help" variant="primary">{tx(locale, 'ขอความช่วยเหลือ', 'Get help')}</ButtonLink>
          <ButtonLink href="/donate" variant="ghostLight">{tx(locale, 'ร่วมสนับสนุน', 'Support the work')}</ButtonLink>
        </div>
      </Container></Section>
    </>
  )
}
