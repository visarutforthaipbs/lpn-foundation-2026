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
              {isThai ? 'โครงการ & พันธมิตร' : 'Projects & partners'}
            </span>
            <h1 className="mt-6 text-4xl font-black leading-[1.05] tracking-tight text-balance md:text-6xl">
              {isThai
                ? 'การเปลี่ยนแปลงที่ยั่งยืนเกิดจากการทำงานร่วมกัน'
                : 'Lasting change is built in coalition.'}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/85 md:text-lg">
              {isThai
                ? 'LPN ทำงานร่วมกับผู้ให้ทุน ภาคประชาสังคม เครือข่ายแรงงาน และพันธมิตรระหว่างประเทศ เพื่อขับเคลื่อนงานต้านการค้ามนุษย์และพัฒนาสิทธิแรงงานในไทย'
                : 'LPN works with funders, civic groups, worker networks, and international partners to drive anti-trafficking action and improve labour rights in Thailand.'}
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

      {/* PRIORITY ISSUES */}
      <section className="border-b border-black bg-white py-20 text-black md:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-12 max-w-2xl">
            <h2 className="text-3xl font-black uppercase tracking-tight md:text-5xl">
              {isThai ? 'ประเด็นที่เราขับเคลื่อน' : 'Priority issues we drive'}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-black/70">
              {isThai
                ? 'หกประเด็นที่กำหนดทิศทางโครงการของ LPN และการลงทุนของพันธมิตรที่ทำงานร่วมกัน'
                : 'Six issues that shape every LPN project and every partner investment we steward.'}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {issues.map((i) => (
              <article
                key={i.number}
                className="group relative overflow-hidden rounded border border-black bg-white p-7 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="absolute top-0 left-0 h-full w-1.5 bg-brand-yellow" />
                <div className="pl-3">
                  <span className="text-xs font-black uppercase tracking-[0.25em] text-black/40">
                    {i.number}
                  </span>
                  <h3 className="mt-3 text-lg font-black uppercase tracking-tight">{i.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-black/75">{i.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* PARTNERS LOGO STRIP */}
      <section className="border-b border-white/10 bg-black py-20 text-white md:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <span className="inline-flex rounded glass-tag px-3 py-1 text-[10px] font-black uppercase tracking-[0.25em] text-brand-yellow">
                {isThai ? 'พันธมิตรของเรา' : 'Our partners'}
              </span>
              <h2 className="mt-6 text-3xl font-black uppercase tracking-tight md:text-4xl">
                {isThai
                  ? 'ผู้ให้ทุน องค์กรประชาสังคม และพันธมิตรระหว่างประเทศ'
                  : 'Funders, civil society, and international allies.'}
              </h2>
            </div>
          </div>

          <ul className="grid grid-cols-2 gap-px overflow-hidden border border-white/15 bg-white/10 sm:grid-cols-3 lg:grid-cols-6">
            {partners.map((p) => (
              <li
                key={p}
                className="flex h-24 items-center justify-center bg-black px-4 text-center text-xs font-black uppercase tracking-widest text-white transition-colors hover:bg-white/5 hover:text-brand-yellow"
              >
                {p}
              </li>
            ))}
          </ul>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {networks.map((n) => (
              <article key={n.name} className="relative overflow-hidden glass-dark rounded p-8">
                <span className="absolute top-0 left-0 h-1.5 w-12 bg-brand-yellow" />
                <div className="text-[10px] font-bold uppercase tracking-widest text-brand-yellow">
                  {n.tag}
                </div>
                <h3 className="mt-3 text-2xl font-black uppercase tracking-tight">{n.name}</h3>
                <p className="mt-4 text-sm leading-relaxed text-white/75">{n.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-yellow py-16 text-black">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-black uppercase tracking-tight md:text-4xl">
              {isThai ? 'ร่วมเป็นพันธมิตรกับ LPN' : 'Partner with LPN.'}
            </h2>
            <p className="mt-3 text-sm text-black/80 md:text-base">
              {isThai
                ? 'หากองค์กรของคุณมุ่งมั่นในการยุติการแสวงหาประโยชน์และเสริมสร้างสิทธิแรงงาน เราพร้อมร่วมงานกับคุณ'
                : 'If your organisation is committed to ending exploitation and strengthening labour rights, we want to collaborate.'}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="rounded bg-black px-6 py-3 text-xs font-black uppercase tracking-widest text-brand-yellow transition-all hover:bg-white hover:text-black border border-black"
            >
              {isThai ? 'ติดต่อร่วมงาน' : 'Get in touch'}
            </Link>
            <Link
              href="/donate"
              className="rounded border border-black bg-transparent px-6 py-3 text-xs font-black uppercase tracking-widest text-black transition-all hover:bg-black hover:text-brand-yellow"
            >
              {isThai ? 'สนับสนุนโครงการ' : 'Fund a project'}
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
