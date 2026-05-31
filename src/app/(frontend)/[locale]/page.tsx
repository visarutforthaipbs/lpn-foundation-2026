import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { getPage } from '@/lib/api'
import { buildMetadata } from '@/lib/seo'

export async function generateMetadata(props: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await props.params
  const t = await getTranslations('home')
  const page = await getPage('home', locale)
  return buildMetadata({
    locale,
    path: '',
    title: page?.meta?.title || 'LPN Foundation',
    description: page?.meta?.description || t('subtitle'),
  })
}

export default async function HomePage(props: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await props.params
  setRequestLocale(locale)

  // Bespoke home design — meta still comes from CMS via generateMetadata,
  // but the rendered page is hand-built to keep the documentary tone.
  const t = await getTranslations('home')
  const isThai = locale === 'th'

  const sectionTitle = isThai
    ? 'เราหยุดวงจรการค้ามนุษย์อย่างไร'
    : 'How We Break The Trafficking Cycle'
  const sectionSubtitle = isThai
    ? 'ปฏิบัติการภาคสนาม การคุ้มครองสิทธิ และการสร้างพลังให้ชุมชนแรงงาน'
    : 'Field rescue, legal protection, and worker-led networks that sustain long-term change.'

  const focusAreas = isThai
    ? [
        {
          title: 'ปฏิบัติการช่วยชีวิต',
          body: 'ทำงานร่วมกับเครือข่ายข้ามพรมแดนเพื่อช่วยเหลือแรงงานที่ถูกบังคับใช้แรงงานและกักขังบนเรือประมง',
          href: '/services',
        },
        {
          title: 'เครือข่ายคุ้มครองแรงงาน',
          body: 'สนับสนุนอาสาสมัครแรงงานข้ามชาติให้เข้าถึงกลไกร้องเรียน การเยียวยา และการคุ้มครองทางกฎหมาย',
          href: '/services',
        },
        {
          title: 'การผลักดันเชิงนโยบาย',
          body: 'รวบรวมหลักฐานเชิงระบบ เพื่อผลักดันห่วงโซ่อุปทานโปร่งใสและยุติการแสวงหาประโยชน์จากแรงงาน',
          href: '/projects',
        },
      ]
    : [
        {
          title: 'Rescue Operations',
          body: 'Cross-border interventions to locate and assist fishers trapped in trafficking and forced labour networks.',
          href: '/services',
        },
        {
          title: 'Worker Protection Networks',
          body: 'Community-led support channels that connect migrant workers to rights education, reporting, and legal help.',
          href: '/services',
        },
        {
          title: 'Policy And Supply-Chain Advocacy',
          body: 'Evidence-driven advocacy pushing for accountability, transparency, and labour dignity across seafood systems.',
          href: '/projects',
        },
      ]

  const impactStats = isThai
    ? [
        { value: '15+', label: 'ปีปฏิบัติการภาคสนาม' },
        { value: '4,986', label: 'ชาวประมงได้รับการช่วยเหลือ' },
        { value: '4', label: 'เสาหลักของบริการ' },
        { value: '24/7', label: 'สายด่วนหลายภาษา' },
      ]
    : [
        { value: '15+', label: 'years on the frontline' },
        { value: '4,986', label: 'fishers freed with our network' },
        { value: '4', label: 'service pillars' },
        { value: '24/7', label: 'multilingual hotline' },
      ]

  const statLabel = isThai
    ? '7 ใน 10 ของแรงงานประมงไทยมีลักษณะของการเป็นแรงงานบังคับ'
    : '7 in 10 fishers in Thai fisheries show indicators of forced labour'

  const statSource = isThai
    ? 'อ้างอิงข้อมูลรายงาน UN-ACT และเครือข่ายภาคประชาสังคม'
    : 'Based on findings from UN-ACT reporting and civil-society evidence.'

  return (
    <>
      {/* Stark Full-Bleed Documentary Hero Section */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-black text-white py-20">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/images/trawler-hero.jpg)',
          }}
        />
        {/* Cinematic gradient overlays to enforce stark drama and contrast */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,0,0,0.1)_0%,rgba(0,0,0,0.9)_80%)]" />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-4 w-full z-10">
          <div className="max-w-4xl">
            <span className="inline-flex rounded glass-tag px-3 py-1 text-[10px] font-black uppercase tracking-[0.25em] text-brand-yellow">
              Labour Rights Promotion Network Foundation
            </span>
            <h1 className="mt-6 text-4xl font-black leading-[1.05] tracking-tight text-balance md:text-7xl">
              {t('title')}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/90 md:text-lg">
              {t('subtitle')}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/donate"
                className="rounded bg-brand-yellow px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-black transition-all hover:bg-white hover:text-black border border-transparent hover:border-black"
              >
                {t('ctaDonate')}
              </Link>
              <Link
                href="/about"
                className="rounded border border-white/45 bg-black/40 px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-white transition-all hover:bg-white hover:text-black"
              >
                {t('ctaLearn')}
              </Link>
            </div>

            {/* Custom LPN Bracket Statistic Card */}
            <div className="mt-14 max-w-2xl relative p-6 md:p-8 border-l-4 border-r-4 border-brand-yellow/80 bg-black/55 backdrop-blur-xs overflow-hidden rounded">
              <span className="absolute top-0 left-0 w-6 h-1.5 bg-brand-yellow"></span>
              <span className="absolute bottom-0 right-0 w-6 h-1.5 bg-brand-yellow"></span>
              <p className="text-xl font-extrabold leading-tight text-white md:text-2xl">
                {statLabel}
              </p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-brand-yellow/90">
                {statSource}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact stats band */}
      <section className="border-y border-black bg-brand-yellow text-black">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-8 px-4 py-10 md:grid-cols-4">
          {impactStats.map((s) => (
            <div key={s.label} className="border-l-4 border-black pl-4">
              <div className="text-3xl font-black tracking-tight md:text-4xl">{s.value}</div>
              <div className="mt-1 text-[10px] font-bold uppercase tracking-widest text-black/70">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Focus Pillars Section */}
      <section className="bg-white py-20 text-black border-t border-black">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-3xl">
              <h2 className="text-3xl font-black leading-tight tracking-tight uppercase md:text-5xl">
                {sectionTitle}
              </h2>
              <p className="mt-4 text-base text-black/75 leading-relaxed">{sectionSubtitle}</p>
            </div>
            <Link
              href="/services"
              className="rounded border border-black px-5 py-2.5 text-[11px] font-black uppercase tracking-widest text-black transition-all hover:bg-black hover:text-brand-yellow"
            >
              {isThai ? 'ดูบริการทั้งหมด →' : 'See all services →'}
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {focusAreas.map((item, idx) => (
              <article
                key={item.title}
                className="group relative p-8 border border-black rounded bg-white transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1.5 h-full bg-brand-yellow"></div>
                <div className="absolute top-4 right-4 text-xs font-bold text-black/25">
                  0{idx + 1}
                </div>
                <h3 className="text-xl font-bold uppercase tracking-tight pr-6">{item.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-black/80">{item.body}</p>
                <div className="mt-8">
                  <Link
                    href={item.href}
                    className="inline-flex items-center text-xs font-black uppercase tracking-widest text-black border-b-2 border-brand-yellow pb-0.5 transition-all group-hover:border-black"
                  >
                    {isThai ? 'อ่านเพิ่มเติม' : 'Read more'}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Rescued Worker Testimony (Layer 3 - Conscious Deep-Dive / The Breath Rule) */}
      <section className="bg-black py-24 text-white border-y border-white/10">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <div className="relative inline-block py-12 px-8 border-t border-b border-brand-yellow/40">
            <span className="absolute left-0 top-0 w-4 h-full border-l-2 border-brand-yellow"></span>
            <span className="absolute right-0 top-0 w-4 h-full border-r-2 border-brand-yellow"></span>
            <p className="text-xl md:text-2xl font-medium italic leading-relaxed text-white/90">
              {isThai
                ? '"ผมถูกขังในกรงเหล็กบนเรือประมงนานสามเดือนกลางมหาสมุทร LPN ประสานงานตำรวจเข้าช่วยเหลือ ตัดโซ่ตรวนที่ล่ามผมไว้ และพาผมกลับสู่อ้อมกอดของครอบครัวอย่างปลอดภัย"'
                : '"I was locked in a cage on a fishing trawler for three months in the open sea. LPN tracked my location, coordinated the rescue, cut the chains, and brought me back to my family."'}
            </p>
            <p className="mt-6 text-xs font-bold uppercase tracking-[0.25em] text-brand-yellow">
              {isThai
                ? '— แรงงานประมงสัญชาติเมียนมา ที่ได้รับความช่วยเหลือในน่านน้ำสากล'
                : '— Rescued Migrant Fisher, Assisted in International Waters'}
            </p>
          </div>
        </div>
      </section>

      {/* Emergency Hotline Center (Action Focus) */}
      <section className="bg-white py-20 text-black border-b border-black">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-block rounded bg-brand-yellow px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-black">
              Emergency Action
            </span>
            <h2 className="mt-3 text-3xl font-black uppercase tracking-tight md:text-5xl">
              {isThai ? 'ศูนย์ช่วยเหลือฉุกเฉิน' : 'Emergency Rescue Hub'}
            </h2>
            <p className="mt-4 text-sm text-black/75">
              {isThai
                ? 'หากคุณตกอยู่ในอันตราย ถูกจำกัดเสรีภาพ หรือพบเห็นการค้ามนุษย์ โปรดโทรหาเราทันที (บริการช่วยเหลือฟรีและเก็บเป็นความลับ)'
                : 'If you are in danger, forced to work, or witness human trafficking, call our hotlines immediately. Confidential and supportive.'}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
            {[
              {
                lang: 'ภาษาไทย (Thai)',
                code: 'TH',
                phone: '084-434-6663',
                label: 'Call Thai Line',
              },
              {
                lang: 'မြန်မာဘာသာ (Burmese)',
                code: 'MM',
                phone: '084-434-6664',
                label: 'Call Burmese Line',
              },
              {
                lang: 'ភាសាខ្មែរ (Khmer)',
                code: 'KH',
                phone: '084-434-6665',
                label: 'Call Khmer Line',
              },
              { lang: 'ພາສາລາວ (Lao)', code: 'LA', phone: '084-434-6666', label: 'Call Lao Line' },
            ].map((hotline) => (
              <div
                key={hotline.code}
                className="border border-black rounded p-6 flex flex-col items-center text-center bg-white shadow-xs"
              >
                <span className="w-10 h-10 rounded-full border border-black flex items-center justify-between justify-content-center text-center text-xs font-black bg-brand-yellow text-black select-none">
                  <span className="w-full text-center">{hotline.code}</span>
                </span>
                <span className="mt-4 text-xs font-bold text-black">{hotline.lang}</span>
                <a
                  href={`tel:${hotline.phone}`}
                  className="mt-3 text-lg font-black text-black tracking-wide border-b-2 border-brand-yellow hover:border-black transition-all"
                >
                  {hotline.phone}
                </a>
                <a
                  href={`tel:${hotline.phone}`}
                  className="mt-6 w-full text-center rounded border border-black bg-black py-2 text-[10px] font-black uppercase tracking-wider text-brand-yellow transition-all hover:bg-brand-yellow hover:text-black hover:font-black"
                >
                  {isThai ? 'โทรด่วน' : 'Call Now'}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
