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
              {isThai ? 'เกี่ยวกับ LPN' : 'About LPN'}
            </span>
            <h1 className="mt-6 text-4xl font-black leading-[1.05] tracking-tight text-balance md:text-6xl">
              {isThai
                ? 'ยืนอยู่กับแรงงานข้ามชาติมากว่า 15 ปี — ตั้งแต่ในทะเลจนถึงห้องประชุมเชิงนโยบาย'
                : 'For 15+ years, standing with migrant workers — from the open sea to the policy table.'}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/85 md:text-lg">
              {isThai
                ? 'LPN ก่อตั้งขึ้นเพื่อปรับปรุงคุณภาพชีวิตของแรงงานข้ามชาติในประเทศไทย โดยเผชิญหน้ากับการแสวงหาประโยชน์ การเลือกปฏิบัติ และความเหลื่อมล้ำเชิงโครงสร้าง'
                : 'LPN was founded to improve the lives of migrant workers in Thailand by confronting exploitation, discrimination, and structural inequality.'}
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

      {/* MISSION / APPROACH / THEORY OF CHANGE */}
      <section className="border-b border-black bg-white py-20 text-black md:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-12 max-w-2xl">
            <h2 className="text-3xl font-black uppercase tracking-tight md:text-5xl">
              {isThai ? 'ทำไมงานนี้จึงสำคัญ' : 'Why this work matters'}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-black/70">
              {isThai
                ? 'แรงงานข้ามชาติเป็นกลุ่มที่เปราะบางที่สุดต่อการละเมิด การค้ามนุษย์ และการบังคับใช้แรงงาน เราจึงทำงานทั้งช่วยเหลือเร่งด่วนและเปลี่ยนระบบไปพร้อมกัน'
                : 'Migrant workers are among the most vulnerable to abuse, trafficking, and forced labour. We pair urgent rescue with long-term systemic change.'}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {pillars.map((p) => (
              <article
                key={p.number}
                className="group relative overflow-hidden rounded border border-black bg-white p-8 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="absolute top-0 left-0 h-full w-1.5 bg-brand-yellow" />
                <div className="pl-3">
                  <span className="text-xs font-black uppercase tracking-[0.25em] text-black/40">
                    {p.number}
                  </span>
                  <h3 className="mt-3 text-2xl font-black uppercase tracking-tight">{p.title}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-black/75">{p.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* LEADERSHIP */}
      <section className="border-b border-white/10 bg-black py-20 text-white md:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-12 max-w-2xl">
            <span className="inline-flex rounded glass-tag px-3 py-1 text-[10px] font-black uppercase tracking-[0.25em] text-brand-yellow">
              {isThai ? 'ผู้นำองค์กร' : 'Leadership'}
            </span>
            <h2 className="mt-6 text-3xl font-black uppercase tracking-tight md:text-4xl">
              {isThai ? 'นักสิทธิที่ทำงานข้างเดียวกับแรงงาน' : 'Activists who walk beside workers.'}
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {leaders.map((l) => (
              <article key={l.name} className="relative overflow-hidden glass-dark rounded p-8">
                <span className="absolute top-0 left-0 h-1.5 w-12 bg-brand-yellow" />
                <p className="text-lg font-bold italic leading-snug text-brand-yellow md:text-xl">
                  {l.quote}
                </p>
                <h3 className="mt-6 text-2xl font-black uppercase tracking-tight">{l.name}</h3>
                <div className="mt-1 text-[10px] font-bold uppercase tracking-widest text-white/55">
                  {l.role}
                </div>
                <p className="mt-5 text-sm leading-relaxed text-white/75">{l.body}</p>
              </article>
            ))}
          </div>

          <div className="mt-10">
            <Link
              href="/team"
              className="inline-flex items-center text-xs font-black uppercase tracking-widest text-white border-b-2 border-brand-yellow pb-0.5 transition-colors hover:border-white"
            >
              {isThai ? 'พบทีมงานทั้งหมด' : 'Meet the full team'} →
            </Link>
          </div>
        </div>
      </section>

      {/* AWARDS */}
      <section className="border-b border-black bg-white py-20 text-black md:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-12 md:grid-cols-[1fr_2fr] md:items-start">
            <div>
              <span className="inline-block rounded bg-brand-yellow px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-black">
                {isThai ? 'การยอมรับ' : 'Recognition'}
              </span>
              <h2 className="mt-4 text-3xl font-black uppercase tracking-tight md:text-4xl">
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
                  <span className="mt-2 inline-block h-1.5 w-3 shrink-0 bg-brand-yellow" />
                  <span className="text-sm leading-relaxed text-black/85">{a}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-yellow py-16 text-black">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-black uppercase tracking-tight md:text-4xl">
              {isThai ? 'ร่วมขับเคลื่อนกับเรา' : 'Stand with the movement.'}
            </h2>
            <p className="mt-3 text-sm text-black/80 md:text-base">
              {isThai
                ? 'การสนับสนุนของคุณคือเชื้อเพลิงของการช่วยเหลือ การคุ้มครองทางกฎหมาย และเครือข่ายแรงงานที่นำไปสู่การเปลี่ยนแปลงระยะยาว'
                : 'Your support fuels rescue operations, legal protection, and worker-led networks that drive lasting change.'}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/donate"
              className="rounded bg-black px-6 py-3 text-xs font-black uppercase tracking-widest text-brand-yellow transition-all hover:bg-white hover:text-black border border-black"
            >
              {isThai ? 'บริจาค' : 'Donate'}
            </Link>
            <Link
              href="/services"
              className="rounded border border-black bg-transparent px-6 py-3 text-xs font-black uppercase tracking-widest text-black transition-all hover:bg-black hover:text-brand-yellow"
            >
              {isThai ? 'ดูบริการของเรา' : 'See our services'}
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
