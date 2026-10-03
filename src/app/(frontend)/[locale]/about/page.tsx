import { setRequestLocale } from 'next-intl/server'
import Image from 'next/image'
import { FileCheck, Languages, ShieldCheck, TrendingUp, Users } from 'lucide-react'
import type { Locale } from '@/i18n/routing'
import { routing } from '@/i18n/routing'
import { getPage, getTeam, getSiteMedia } from '@/lib/api'
import { buildMetadata } from '@/lib/seo'
import { WixIntegratedCopy } from '@/components/WixIntegratedCopy'
import { MediaImage } from '@/components/MediaImage'
import { ButtonLink, Container, Section, SectionHeading } from '@/components/ui'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata(props: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await props.params
  const page = await getPage('about', locale)
  return buildMetadata({
    locale,
    path: '/about',
    title: page?.meta?.title || (locale === 'th' ? 'เกี่ยวกับเรา — LPN' : 'About — LPN'),
    description:
      page?.meta?.description ||
      (locale === 'th'
        ? 'LPN คือองค์กรแนวหน้าด้านสิทธิแรงงานข้ามชาติในประเทศไทย ช่วยเหลือให้คนเข้าถึงการคุ้มครองวันนี้ และสร้างระบบที่ปลอดภัยขึ้นในวันหน้า'
        : 'LPN is a frontline migrant-rights organisation in Thailand that helps people access protection today and builds safer systems for tomorrow.'),
  })
}

export default async function AboutPage(props: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await props.params
  setRequestLocale(locale)
  const th = locale === 'th'
  const [team, mediaMap] = await Promise.all([
    getTeam(locale),
    getSiteMedia(),
  ])

  const audiences = th ? [
    {
      title: 'แรงงานและครอบครัว',
      body: '“มีใครช่วยเรื่องนี้ได้ไหม อย่างปลอดภัย และในภาษาที่เราเข้าใจ?” — LPN ช่วยเหลือเรื่องค่าจ้าง เอกสาร สุขภาพ ความปลอดภัย และการศึกษาของลูกหลาน',
    },
    {
      title: 'ผู้สนับสนุนและพันธมิตร',
      body: '“ตอนนี้ LPN ทำอะไร มีหลักฐานอะไร และร่วมสนับสนุนอย่างรับผิดชอบได้อย่างไร?” — เรามีผลการทำงานระบุช่วงเวลาและแหล่งที่มา พร้อมช่องทางสนับสนุนที่ตรวจสอบแล้ว',
    },
    {
      title: 'นักวิจัยและสื่อมวลชน',
      body: '“LPN เรียนรู้อะไรจากภาคสนาม?” — งานวิจัยและประสบการณ์กรณีเผยให้เห็นจุดที่ระบบล้มเหลว และแนวทางปรับปรุงที่ทำได้จริง',
    },
  ] : [
    {
      title: 'Workers and families',
      body: '“Can someone help me safely, in a language I understand?” — LPN helps with pay, documents, health, safety, and children’s education.',
    },
    {
      title: 'Supporters and partners',
      body: '“What does LPN do now, what evidence supports it, and how can I contribute responsibly?” — dated results with sources, and verified ways to give.',
    },
    {
      title: 'Researchers and journalists',
      body: '“What does LPN know from the field?” — research and case experience showing where systems fail and what practical changes could help.',
    },
  ]

  const values = th ? [
    { icon: ShieldCheck, title: 'ความปลอดภัยก่อนสิ่งอื่น', body: 'ช่องทางติดต่อที่ตรวจสอบแล้ว ความคาดหวังที่ตรงตามจริง และไม่บังคับให้กรอกแบบฟอร์มหรือเปิดเผยข้อมูลก่อนได้รับความช่วยเหลือ' },
    { icon: Users, title: 'ผู้คนที่มีเสียงและทางเลือก', body: 'นำเสนอแรงงานในฐานะผู้มีศักยภาพและเจตจำนง เรื่องราวต้องผ่านความยินยอม และไม่ใช้ภาพความทุกข์ทรมานเป็นภาพหลักขององค์กร' },
    { icon: FileCheck, title: 'ข้อมูลที่มีบริบท', body: 'ตัวเลขผลการทำงานระบุช่วงเวลา นิยาม และแหล่งที่มา ความสำเร็จในอดีตระบุปีอย่างชัดเจน งานวิจัยไม่ถูกนำเสนอเป็นผลลัพธ์ที่ LPN สร้าง' },
    { icon: Languages, title: 'ภาษาท้องถิ่นคือส่วนหนึ่งของบริการ', body: 'หน้าเว็บไทยและอังกฤษสมบูรณ์ คำแนะนำสำคัญในภาษาพม่า เขมร และลาว ต้องผ่านการตรวจโดยเจ้าของภาษา' },
    { icon: TrendingUp, title: 'หนึ่งทฤษฎีการเปลี่ยนแปลงที่เชื่อมกัน', body: 'งานช่วยเหลือโดยตรง ความรู้ชุมชน และการเปลี่ยนแปลงเชิงระบบ เสริมกัน โดยไม่อ้างว่าทุกกรณีนำไปสู่การเปลี่ยนแปลงนโยบาย' },
  ] : [
    { icon: ShieldCheck, title: 'Safety before everything', body: 'Verified contact routes, realistic expectations, and no form, account, or data disclosure required before someone can get help.' },
    { icon: Users, title: 'People with voices and choices', body: 'Workers are shown with agency. Stories are consented, and distress imagery is not our default identity.' },
    { icon: FileCheck, title: 'Claims with context', body: 'Outcome figures carry a period, definition, and source. Historic achievements stay clearly dated, and research is not presented as LPN-delivered outcomes.' },
    { icon: Languages, title: 'Local language is part of service', body: 'Thai and English pages are complete, and core help instructions in Burmese, Khmer, and Lao require native-speaker review before publication.' },
    { icon: TrendingUp, title: 'One connected theory of change', body: 'Direct response, community knowledge, and system change reinforce each other — without implying every case creates policy change.' },
  ]

  // Dated history — PRD: historical accomplishments remain clearly dated.
  const timeline = th ? [
    { year: '2547 (2004)', body: 'ก่อตั้งเครือข่ายส่งเสริมคุณภาพชีวิตแรงงาน (LPN) โดยปฏิมา ตั้งปรัชญากูล และสมพงษ์ สระแก้ว เพื่อเรียกร้องความเป็นธรรมให้แรงงานข้ามชาติในไทย' },
    { year: '2551 (2008)', body: 'หลักฐานจากการทำงานร่วมกับแรงงาน มีส่วนผลักดันการแก้ไขพระราชบัญญัติป้องกันและปราบปรามการค้ามนุษย์ เพิ่มโทษผู้กระทำผิดและนายหน้า' },
    { year: '2557–2559 (2014–2016)', body: 'ปฏิบัติการช่วยเหลือลูกเรือประมงที่ถูกทิ้งบนเกาะในอินโดนีเซีย ร่วมกับสื่อมวลชน IOM และรัฐบาลอินโดนีเซีย — ช่วยเหลือลูกเรือกว่า 2,000 คน' },
    { year: '2560 (2017)', body: 'ปฏิมา ตั้งปรัชญากูล ได้รับการเสนอชื่อชิงรางวัลโนเบลสาขาสันติภาพ จากการทำงานเพื่อยุติแรงงานทาสในอุตสาหกรรมประมง' },
    { year: '2562 (2019)', body: 'สารคดี Ghost Fleet ออกฉาย บันทึกภารกิจช่วยเหลือลูกเรือประมงของ LPN' },
    { year: 'ปัจจุบัน', body: 'งานของ LPN ครอบคลุมการช่วยเหลือรายกรณี การศึกษาและเยาวชน เสียงแรงงาน งานวิจัย และการผลักดันนโยบาย — โดยมีสิทธิของแรงงานข้ามชาติเป็นศูนย์กลาง' },
  ] : [
    { year: '2004', body: 'The Labour Rights Promotion Network (LPN) is founded by Patima Tungpuchayakul and Sompong Srakaew to seek justice for migrant workers in Thailand.' },
    { year: '2008', body: 'Evidence from LPN casework contributes to the amendment of Thailand’s Anti-Trafficking in Persons Act, increasing penalties for traffickers and brokers.' },
    { year: '2014–2016', body: 'Rescue operations for fishers stranded on Indonesian islands, with journalists, IOM, and the Indonesian government — more than 2,000 fishers brought to safety.' },
    { year: '2017', body: 'Patima Tungpuchayakul is nominated for the Nobel Peace Prize for work ending slavery in the fishing industry.' },
    { year: '2019', body: 'The documentary “Ghost Fleet” is released, recording LPN’s fisher rescue missions.' },
    { year: 'Today', body: 'LPN’s work spans direct casework, education and youth, worker voice, research, and advocacy — with migrant workers’ rights at the centre.' },
  ]

  const leaders = th ? [
    {
      name: 'ปฏิมา ตั้งปรัชญากูล',
      role: 'ผู้ร่วมก่อตั้งและผู้อำนวยการ',
      body: 'ผู้ได้รับการเสนอชื่อชิงรางวัลโนเบลสาขาสันติภาพปี 2017 นำงานช่วยเหลือและงานรณรงค์ด้านสิทธิแรงงานประมงในระดับภูมิภาค — เรื่องราวของเธอถูกถ่ายทอดในภาพยนตร์สารคดี Ghost Fleet',
      media: mediaMap.patima,
    },
    {
      name: 'สมพงษ์ สระแก้ว',
      role: 'ผู้ร่วมก่อตั้งและที่ปรึกษานโยบาย',
      body: 'นักสังคมสงเคราะห์ผู้ก่อตั้ง LPN ในปี 2547 งานหลักฐานของเขาช่วยผลักดันการแก้ไขกฎหมายต่อต้านการค้ามนุษย์ และยังคงทำงานด้านนโยบายแรงงานและช่วยเหลือแรงงานข้ามชาติ',
      media: mediaMap.sompong,
    },
  ] : [
    {
      name: 'Patima Tungpuchayakul',
      role: 'Co-founder & Director',
      body: '2017 Nobel Peace Prize nominee. Leads LPN’s assistance work and regional advocacy for fishers’ rights — featured in the award-winning documentary film Ghost Fleet.',
      media: mediaMap.patima,
    },
    {
      name: 'Sompong Srakaew',
      role: 'Co-founder & Policy advisor',
      body: 'The social worker who founded LPN in 2004. His evidence-driven advocacy shaped Thailand’s 2008 anti-trafficking law amendment and continues in labour policy.',
      media: mediaMap.sompong,
    },
  ]

  const networks = [
    {
      abbr: 'FLG',
      name: th ? 'กลุ่มผู้นำแรงงานประมง' : 'Fishermen Leaders Group',
      sub: th ? 'เฝ้าระวังและช่วยเหลือแรงงานประมง' : 'Maritime worker leadership',
      logo: '/logos/subbrands/flg-white.png',
    },
    {
      abbr: 'MLN',
      name: th ? 'เครือข่ายผู้นำแรงงานข้ามชาติ' : 'Migrant Leaders Network',
      sub: th ? 'เครือข่ายประสานงานระหว่างกลุ่ม' : 'Cross-sector worker leadership',
      logo: '/logos/subbrands/mln-white.png',
    },
    {
      abbr: 'MMLG',
      name: th ? 'กลุ่มผู้นำแรงงานเมียนมา' : 'Myanmar Migrant Leaders Group',
      sub: th ? 'สื่อสารและดูแลชุมชนเมียนมา' : 'Community solidarity & rights',
      logo: '/logos/subbrands/mmlg-white.png',
    },
    {
      abbr: 'CMLG',
      name: th ? 'กลุ่มผู้นำแรงงานกัมพูชา' : 'Cambodian Migrant Leaders Group',
      sub: th ? 'การประสานความช่วยเหลือในชุมชน' : 'Community outreach & assistance',
      logo: '/logos/subbrands/cmlg-white.png',
    },
    {
      abbr: 'LMLG',
      name: th ? 'กลุ่มผู้นำแรงงานลาว' : 'Lao Migrant Leaders Group',
      sub: th ? 'การคุ้มครองและสวัสดิการแรงงาน' : 'Workplace welfare & mutual aid',
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
            alt={th ? 'ชุมชนแรงงานข้ามชาติและทีมงาน LPN' : 'Migrant community outreach and LPN team'}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-30 brightness-90 contrast-105"
          />
          <div className="absolute inset-0 bg-linear-to-r from-black via-black/85 to-black/60 pointer-events-none" />
          <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-black/40 pointer-events-none" />
        </div>

        <div className="container-page relative z-10 py-20 md:py-28">
          <p className="eyebrow text-brand-yellow">{th ? 'เกี่ยวกับ LPN' : 'About LPN'}</p>
          <h1 className="t-display mt-7 max-w-4xl text-white">
            {th
              ? 'องค์กรแนวหน้าด้านสิทธิแรงงานข้ามชาติในประเทศไทย'
              : 'A frontline migrant-rights organisation in Thailand.'}
          </h1>
          <p className="t-lede mt-8 max-w-2xl text-white/85">
            {th
              ? 'เราช่วยให้แรงงานและครอบครัวเข้าถึงการคุ้มครองในวันนี้ และสร้างระบบที่ปลอดภัยขึ้นในวันหน้า — ด้วยงานช่วยเหลือรายกรณีที่ไว้ใจได้ ควบคู่กับการศึกษา เสียงแรงงาน งานวิจัย และการผลักดันนโยบาย'
              : 'We help workers and families access protection today and build safer systems for tomorrow — combining trusted, multilingual case support with education, worker voice, field research, and advocacy.'}
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href="/get-help" variant="primary">{th ? 'ขอความช่วยเหลือ' : 'Get help'}</ButtonLink>
            <ButtonLink href="/donate" variant="ghostLight">{th ? 'ร่วมสนับสนุน' : 'Support the work'}</ButtonLink>
          </div>
        </div>
      </section>

      {/* WHO LPN SERVES */}
      <Section tone="light"><Container>
        <SectionHeading
          eyebrow={th ? 'เราทำงานเพื่อใคร' : 'Who LPN serves'}
          title={th ? 'ทุกหน้าของเว็บนี้ตอบคำถามสองคำถามที่เท่าเทียมกัน' : 'Every page answers two equally important questions.'}
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {audiences.map((a) => (
            <article key={a.title} className="border border-black/15 bg-paper p-7">
              <h3 className="t-h3">{a.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-black/75">{a.body}</p>
            </article>
          ))}
        </div>
      </Container></Section>

      {/* VALUES */}
      <Section tone="paper"><Container>
        <SectionHeading
          eyebrow={th ? 'หลักการของเรา' : 'Our principles'}
          title={th ? 'ความมั่นคง ความเป็นมนุษย์ และความรับผิดชอบ' : 'Steady, humane, and competent.'}
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
          eyebrow={th ? 'เส้นทางที่ผ่านมา' : 'Our history, in context'}
          title={th ? 'เหตุการณ์สำคัญระบุช่วงเวลา' : 'Key moments, clearly dated.'}
          lede={th
            ? 'ความกล้าหาญในการช่วยเหลือกลางทะเลเป็นส่วนสำคัญของประวัติศาสตร์เรา — และเป็นเพียงส่วนหนึ่งของงานทั้งหมด'
            : 'Courageous rescues at sea are an important part of our history — and one part of the whole.'}
        />
        <ol className="mt-12 grid gap-6">
          {timeline.map((t) => (
            <li key={t.year} className="border-l-2 border-brand-yellow pl-6">
              <span className="t-label text-brand-yellow">{t.year}</span>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-white/85">{t.body}</p>
            </li>
          ))}
        </ol>
        <p className="mt-8 max-w-3xl border-l border-white/25 pl-4 text-xs leading-relaxed text-white/60 italic">
          {th
            ? '* เครือข่ายส่งเสริมคุณภาพชีวิตแรงงาน เปลี่ยนชื่อเป็น มูลนิธิเครือข่ายส่งเสริมคุณภาพชีวิตแรงงาน (Labour Protection Network) เพื่อสะท้อนชื่อย่อ LPN ที่เป็นที่รู้จัก'
            : '* The Labour Rights Promotion Network was renamed to the Labour Protection Network to better reflect its well-known acronym, LPN.'}
        </p>
      </Container></Section>

      {/* LEADERSHIP */}
      <Section tone="light"><Container>
        <SectionHeading
          eyebrow={th ? 'ผู้นำองค์กร' : 'Leadership'}
          title={th ? 'คนที่ทำงานเคียงข้างแรงงาน' : 'People who work alongside workers.'}
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {leaders.map((l) => (
            <article key={l.name} className="flex flex-col border border-black/15 bg-paper p-6 sm:p-8">
              {l.media && (
                <div className="relative mb-6 aspect-16/10 w-full overflow-hidden border border-black/10 bg-black/5">
                  <MediaImage
                    media={l.media}
                    alt={l.name}
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <h3 className="t-h3">{l.name}</h3>
              <div className="t-label mt-1.5 text-black/70 font-semibold">{l.role}</div>
              <p className="mt-4 text-sm leading-relaxed text-black/75 flex-1">{l.body}</p>
            </article>
          ))}
        </div>
      </Container></Section>

      {/* TEAM */}
      <Section tone="paper"><Container>
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow={th ? 'ทีมงาน' : 'The team'}
            title={th ? 'นักกิจกรรม นักสังคมสงเคราะห์ และอดีตแรงงาน' : 'Activists, social workers, and former workers.'}
          />
          <ButtonLink href="/team" variant="ghostDark">{th ? 'ดูทีมงานทั้งหมด' : 'Meet the full team'} →</ButtonLink>
        </div>
        {team.length > 0 && (
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {team.slice(0, 4).map((m) => (
              <article key={m.id} className="border border-black/15 bg-white p-5">
                {m.photo && typeof m.photo !== 'number' ? (
                  <MediaImage media={m.photo} className="h-20 w-20 rounded-full object-cover" />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-yellow/20 text-xs font-black text-black/50">LPN</div>
                )}
                <h3 className="t-h3 mt-4">{m.name}</h3>
                {m.role && <div className="t-label mt-1 text-black/55">{m.role}</div>}
              </article>
            ))}
          </div>
        )}
      </Container></Section>

      {/* WORKER-LED NETWORKS */}
      <Section tone="dark" className="border-t border-white/10">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow text-brand-yellow">
              {th ? 'เครือข่ายแรงงานร่วมขับเคลื่อน' : 'Worker-Led Community Networks'}
            </p>
            <h2 className="t-h2 mt-4 text-white">
              {th ? 'องค์กรผู้นำแรงงานที่เป็นพลังหลักในชุมชน' : 'Migrant Leadership Groups Working Alongside LPN'}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-white/80 sm:text-base">
              {th
                ? 'LPN ทำงานร่วมกับ 5 เครือข่ายผู้นำแรงงานข้ามชาติ เพื่อส่งเสริมการพึ่งพาตนเอง การเฝ้าระวัง และการช่วยเหลือซึ่งกันและกัน'
                : 'LPN works alongside five organized migrant leadership groups to build collective voice, monitor rights, and provide community mutual aid.'}
            </p>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {networks.map((net) => (
              <div
                key={net.abbr}
                className="flex flex-col items-center justify-center border border-white/15 bg-white/5 p-6 text-center transition-all hover:border-brand-yellow/50 hover:bg-white/10"
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
                <span className="mt-1 text-[11px] text-white/60">
                  {net.sub}
                </span>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* GOVERNANCE & TRANSPARENCY */}
      <Section tone="light"><Container>
        <SectionHeading
          eyebrow={th ? 'ธรรมาภิบาลและความโปร่งใส' : 'Governance & transparency'}
          title={th ? 'หลักฐานที่ตรวจสอบได้ คือมาตรฐานของเรา' : 'Evidence you can check is the standard.'}
        />
        <div className="mt-8 max-w-3xl">
          <p className="t-lede text-black/75">
            {th
              ? 'LPN เป็นมูลนิธิที่จดทะเบียนในประเทศไทย สำนักงานใหญ่ตั้งอยู่ในจังหวัดปทุมธานี ผลการทำงานและรายงานทั้งหมดแสดงช่วงเวลา นิยาม และแหล่งที่มาในหน้าผลการทำงานและรายงาน รายละเอียดการเงินและบัญชีรับบริจาคจะเผยแพร่เมื่อผ่านการตรวจสอบจาก LPN'
              : 'LPN is a registered foundation in Thailand, headquartered in Pathum Thani. Every published figure carries a period, definition, and source on our Impact & Reports page. Financial and donation account details are published only after LPN verification.'}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/impact" variant="solidDark">{th ? 'ดูผลการทำงานและรายงาน' : 'Impact & Reports'}</ButtonLink>
            <ButtonLink href="/contact" variant="ghostDark">{th ? 'ติดต่อเรา' : 'Contact LPN'}</ButtonLink>
          </div>
        </div>
      </Container></Section>

      {/* Archival Wix copy preserved by editors in Payload blocks. */}
      <Container>
        <WixIntegratedCopy slug="about" locale={locale} />
      </Container>

      {/* CTA — dual path */}
      <Section tone="dark"><Container className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
        <SectionHeading
          tone="light"
          eyebrow={th ? 'ก้าวต่อไป' : 'Next step'}
          title={th ? 'ต้องการความช่วยเหลือ หรืออยากสนับสนุนงานของเรา?' : 'Need help, or want to support the work?'}
          lede={th
            ? 'สองเส้นทางมีความสำคัญเท่าเทียมกัน — เลือกเส้นทางที่ตรงกับคุณ'
            : 'Two equally important paths — choose the one that fits you.'}
        />
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/get-help" variant="primary">{th ? 'ขอความช่วยเหลือ' : 'Get help'}</ButtonLink>
          <ButtonLink href="/donate" variant="ghostLight">{th ? 'ร่วมสนับสนุน' : 'Support the work'}</ButtonLink>
        </div>
      </Container></Section>
    </>
  )
}
