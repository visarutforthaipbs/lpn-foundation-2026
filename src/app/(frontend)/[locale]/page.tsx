import { WixIntegratedCopy } from '@/components/WixIntegratedCopy'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import Image from 'next/image'
import type { Locale } from '@/i18n/routing'
import { getPage } from '@/lib/api'
import { buildMetadata } from '@/lib/seo'
import { HOTLINES, telHref } from '@/lib/content'
import { Container, Section, SectionHeading, StatBand, ButtonLink, CtaBand, EditorialRow, Eyebrow, MarkLink } from '@/components/ui'

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
      {/* ---------------------------------------------------------------- HERO */}
      <section className="relative isolate overflow-hidden bg-black text-white">
        <Image
          src="/images/trawler-hero.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,0,0,0.1)_0%,rgba(0,0,0,0.9)_80%)]" />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/45 to-transparent" />

        <div className="container-page relative z-10 py-24 md:py-36">
          <div className="max-w-4xl">
            <Eyebrow>Labour Rights Promotion Network Foundation</Eyebrow>
            <h1 className="t-display mt-6">{t('title')}</h1>
            <p className="t-lede mt-7 max-w-2xl text-white/90">{t('subtitle')}</p>

            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink href="/donate" variant="primary">
                {t('ctaDonate')}
              </ButtonLink>
              <ButtonLink href="/about" variant="ghostLight">
                {t('ctaLearn')}
              </ButtonLink>
            </div>

            {/* Bracket stat card — the one high-Surprisal fact of the page */}
            <div className="relative mt-14 max-w-2xl overflow-hidden rounded border-x-4 border-brand-yellow/80 bg-black/55 p-6 backdrop-blur-sm md:p-8">
              <span className="absolute top-0 left-0 h-1.5 w-6 bg-brand-yellow" aria-hidden="true" />
              <span className="absolute right-0 bottom-0 h-1.5 w-6 bg-brand-yellow" aria-hidden="true" />
              <p className="text-xl font-extrabold leading-tight text-white md:text-2xl">{statLabel}</p>
              <p className="mt-3 text-xs font-semibold tracking-widest text-brand-yellow/90 uppercase">
                {statSource}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- STAT BAND */}
      <Section tone="yellow" tight className="border-y border-black">
        <Container>
          <StatBand stats={impactStats} tone="yellow" />
        </Container>
      </Section>

      {/* ------------------------------------------------------- FOCUS PILLARS */}
      <Section tone="light" className="contain-pillars on-light">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-8">
            <SectionHeading title={sectionTitle} lede={sectionSubtitle} />
            <ButtonLink href="/services" variant="ghostDark">
              {isThai ? 'ดูบริการทั้งหมด' : 'See all services'} →
            </ButtonLink>
          </div>

          <div className="mt-12">
            {focusAreas.map((item, idx) => (
              <EditorialRow
                key={item.title}
                index={`0${idx + 1}`}
                title={item.title}
                body={item.body}
                actions={
                  <MarkLink href={item.href} className="text-black">
                    {isThai ? 'อ่านเพิ่มเติม' : 'Read more'} →
                  </MarkLink>
                }
              />
            ))}
          </div>
        </Container>
      </Section>

      {/* ------------------------------------------------------ TESTIMONY (breath) */}
      <Section tone="dark" className="border-y border-white/10 contain-testimony">
        <Container>
          <figure className="relative mx-auto max-w-3xl border-x-2 border-brand-yellow/40 px-8 py-12 text-center">
            <blockquote className="t-lede font-medium text-white/90 italic">
              {isThai
                ? '"ผมถูกขังในกรงเหล็กบนเรือประมงนานสามเดือนกลางมหาสมุทร LPN ประสานงานตำรวจเข้าช่วยเหลือ ตัดโซ่ตรวนที่ล่ามผมไว้ และพาผมกลับสู่อ้อมกอดของครอบครัวอย่างปลอดภัย"'
                : '"I was locked in a cage on a fishing trawler for three months in the open sea. LPN tracked my location, coordinated the rescue, cut the chains, and brought me back to my family."'}
            </blockquote>
            <figcaption className="mt-8 text-xs font-bold tracking-[0.25em] text-brand-yellow uppercase">
              {isThai
                ? '— แรงงานประมงสัญชาติเมียนมา ที่ได้รับความช่วยเหลือในน่านน้ำสากล'
                : '— Rescued Migrant Fisher, Assisted in International Waters'}
            </figcaption>
          </figure>
        </Container>
      </Section>

      {/* ------------------------------------------------------------- CTA BAND */}
      <CtaBand
        heading={isThai ? 'ร่วมยุติระบบทาสสมัยใหม่ไปด้วยกัน' : 'Help us end modern slavery'}
        body={
          isThai
            ? 'การสนับสนุนของคุณช่วยให้เราทำงานช่วยชีวิตแรงงาน สร้างเครือข่ายคุ้มครอง และขยายงานป้องกันการค้ามนุษย์'
            : 'Your support funds rescue operations, worker protection networks, and anti-trafficking prevention programmes.'
        }
        actions={
          <ButtonLink href="/donate" variant="solidDark">
            {isThai ? 'ร่วมบริจาค' : 'Donate now'}
          </ButtonLink>
        }
      />

      {/* ------------------------------------------------------ HOTLINE CENTER */}
      <Section tone="paper" className="contain-hotline on-light">
        <Container>
          <SectionHeading
            eyebrow={isThai ? 'ช่วยเหลือฉุกเฉิน' : 'Emergency action'}
            align="center"
            title={isThai ? 'ศูนย์ช่วยเหลือฉุกเฉิน' : 'Emergency Rescue Hub'}
            lede={
              isThai
                ? 'หากคุณตกอยู่ในอันตราย ถูกจำกัดเสรีภาพ หรือพบเห็นการค้ามนุษย์ โปรดโทรหาเราทันที (บริการช่วยเหลือฟรีและเก็บเป็นความลับ)'
                : 'If you are in danger, forced to work, or witness human trafficking, call our hotlines immediately. Confidential and supportive.'
            }
          />

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {HOTLINES.map((hotline) => (
              <div key={hotline.code} className="card card-marked flex flex-col items-center p-6 text-center">
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-black bg-brand-yellow text-xs font-black text-black"
                  aria-hidden="true"
                >
                  {hotline.code}
                </span>
                <div className="mt-4 text-sm font-bold text-black">
                  {isThai ? hotline.langTh : hotline.langEn}
                </div>
                <a
                  href={telHref(hotline.phone)}
                  className="mt-2 border-b-2 border-brand-yellow pb-1 text-lg font-black tracking-wide text-black transition-colors hover:border-black"
                >
                  {hotline.phone}
                </a>
                <a href={telHref(hotline.phone)} className="btn btn-solid-dark mt-6 w-full">
                  {isThai ? 'โทรด่วน' : 'Call now'}
                </a>
              </div>
            ))}
          </div>
        </Container>
      </Section>
      <WixIntegratedCopy slug="home" locale={locale} />
    </>
  )
}
