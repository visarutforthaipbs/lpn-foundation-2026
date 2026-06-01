import { setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { routing } from '@/i18n/routing'
import { getPage, getTeam } from '@/lib/api'
import { MediaImage } from '@/components/MediaImage'
import { buildMetadata } from '@/lib/seo'
import Image from 'next/image'

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
              {isThai ? 'ทีม LPN' : 'The LPN team'}
            </span>
            <h1 className="mt-6 text-4xl font-black leading-[1.05] tracking-tight text-balance md:text-6xl">
              {isThai
                ? 'นักกิจกรรม นักสังคมสงเคราะห์ และอดีตแรงงานที่ปฏิเสธจะยอมแพ้'
                : 'Activists, social workers, and former workers who refuse to look away.'}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/85 md:text-lg">
              {isThai
                ? 'เครือข่ายของเราเป็นทั้งหน่วยกู้ภัย หน่วยกฎหมาย ครู และผู้นำชุมชน รวมพลังกันเพื่อหยุดวงจรการแสวงหาประโยชน์จากแรงงาน'
                : 'Our network is at once rescue team, legal aid, teachers, and community leaders — joined in the work of breaking labour exploitation.'}
            </p>
          </div>

          <dl className="mt-12 grid max-w-2xl grid-cols-3 gap-4 border-l-4 border-brand-yellow pl-6">
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

      {/* LEADERSHIP */}
      <section className="border-b border-black bg-white py-20 text-black md:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-black uppercase tracking-tight md:text-5xl">
                {isThai ? 'ผู้นำองค์กร' : 'Leadership'}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-black/70">
                {isThai
                  ? 'ผู้ร่วมก่อตั้งและหัวหน้าฝ่ายภาคสนามที่กำหนดทิศทางของ LPN มากว่าสองทศวรรษ'
                  : 'Co-founders and frontline leads who have shaped LPN’s direction for two decades.'}
              </p>
            </div>
            <Link
              href="/about"
              className="rounded border border-black px-5 py-2.5 text-[11px] font-black uppercase tracking-widest text-black transition-all hover:bg-black hover:text-brand-yellow"
            >
              {isThai ? 'อ่านเรื่องราวของเรา →' : 'Our story →'}
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {leaders.map((l) => (
              <article
                key={l.name}
                className="group relative overflow-hidden rounded border border-black bg-white p-8 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="absolute top-0 left-0 h-full w-1.5 bg-brand-yellow" />
                <div className="pl-3">
                  <p className="text-base font-bold italic leading-snug text-black/85">{l.quote}</p>
                  <h3 className="mt-6 text-xl font-black uppercase tracking-tight">{l.name}</h3>
                  <div className="mt-1 text-[10px] font-bold uppercase tracking-widest text-black/55">
                    {l.role}
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-black/75">{l.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FULL TEAM GRID */}
      <section className="border-b border-white/10 bg-black py-20 text-white md:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-12 max-w-2xl">
            <span className="inline-flex rounded glass-tag px-3 py-1 text-[10px] font-black uppercase tracking-[0.25em] text-brand-yellow">
              {isThai ? 'สมาชิกทีม' : 'Team members'}
            </span>
            <h2 className="mt-6 text-3xl font-black uppercase tracking-tight md:text-4xl">
              {isThai ? 'หลายเสียง ภารกิจเดียวกัน' : 'Many voices. One mission.'}
            </h2>
          </div>

          {team.length === 0 ? (
            <p className="text-white/55">
              {isThai
                ? 'ยังไม่มีข้อมูลทีมงานในระบบ — โปรดเพิ่มข้อมูลในแผงควบคุม'
                : 'No team members yet — add them from the admin panel.'}
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {team.map((m) => (
                <article
                  key={m.id}
                  className="group relative overflow-hidden glass-dark rounded p-6"
                >
                  <span className="absolute top-0 left-0 h-1.5 w-10 bg-brand-yellow" />
                  {m.photo && typeof m.photo !== 'number' ? (
                    <MediaImage
                      media={m.photo}
                      className="h-24 w-24 rounded-full border border-white/20 object-cover"
                    />
                  ) : (
                    <div className="flex h-24 w-24 items-center justify-center rounded-full border border-white/20 bg-brand-yellow/10 text-xs font-black text-brand-yellow">
                      LPN
                    </div>
                  )}
                  <h3 className="mt-5 text-base font-black uppercase tracking-tight text-white">
                    {m.name}
                  </h3>
                  {m.role && (
                    <div className="mt-1 text-[10px] font-bold uppercase tracking-widest text-white/55">
                      {m.role}
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-yellow py-16 text-black">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-black uppercase tracking-tight md:text-4xl">
              {isThai ? 'ทำงานกับเรา' : 'Work with us.'}
            </h2>
            <p className="mt-3 text-sm text-black/80 md:text-base">
              {isThai
                ? 'ทั้งบทบาทอาสาสมัคร นักศึกษาฝึกงาน หรือพันธมิตรองค์กร เราต้อนรับคนที่พร้อมยืนข้างแรงงาน'
                : 'Volunteer, intern, or partner — we welcome anyone ready to stand with workers.'}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="rounded bg-black px-6 py-3 text-xs font-black uppercase tracking-widest text-brand-yellow transition-all hover:bg-white hover:text-black border border-black"
            >
              {isThai ? 'ติดต่อทีม' : 'Contact the team'}
            </Link>
            <Link
              href="/donate"
              className="rounded border border-black bg-transparent px-6 py-3 text-xs font-black uppercase tracking-widest text-black transition-all hover:bg-black hover:text-brand-yellow"
            >
              {isThai ? 'สนับสนุนภารกิจ' : 'Fund the mission'}
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
