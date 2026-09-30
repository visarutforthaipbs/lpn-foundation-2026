import { setRequestLocale } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'
import { routing } from '@/i18n/routing'
import { getPage, getMediaByIds } from '@/lib/api'
import { buildMetadata } from '@/lib/seo'
import { aboutEn, aboutTh, type AboutCopy } from '@/content/about'
import { MediaImage } from '@/components/MediaImage'
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
  const copy: AboutCopy = isThai ? aboutTh : aboutEn
  const mediaMap = await getMediaByIds([253, 254])

  const leaders = isThai
    ? [
        {
          name: 'Patima Tungpuchayakul',
          role: 'ผู้อำนวยการ และผู้ร่วมก่อตั้ง',
          quote: '"เป้าหมายของฉันคือการช่วยชีวิตคน"',
          body: 'หนึ่งในผู้นำการต่อสู้เพื่อยุติการบังคับใช้แรงงานบนเรือประมงในเอเชียตะวันออกเฉียงใต้ ผู้ได้รับการเสนอชื่อชิงรางวัลโนเบลสาขาสันติภาพในปี 2017 และเป็นแกนหลักในการกู้ภัยชาวประมงที่ถูกค้ามนุษย์ไปยังอินโดนีเซีย — เรื่องราวที่ถูกถ่ายทอดในสารคดี Ghost Fleet',
          media: mediaMap[253],
        },
        {
          name: 'Sompong Srakaew',
          role: 'ผู้ร่วมก่อตั้ง และที่ปรึกษานโยบาย',
          quote: '"งานนี้คือชีวิตของผม"',
          body: 'นักสังคมสงเคราะห์ที่ก่อตั้ง LPN ในปี 2547 หลังจากนำการบุกค้นช่วยเหลือแรงงานเมียนมาจากโรงงานแปรรูปกุ้ง ผลักดันให้เกิดการแก้ไขพระราชบัญญัติป้องกันและปราบปรามการค้ามนุษย์ในปี 2551 และยังคงให้คำปรึกษานโยบายเพื่อยุติการเป็นทาสยุคใหม่',
          media: mediaMap[254],
        },
      ]
    : [
        {
          name: 'Patima Tungpuchayakul',
          role: 'Director & Co-founder',
          quote: '"My goal is to save lives."',
          body: 'A leading figure in the fight to end slavery aboard fishing vessels across Southeast Asia. 2017 Nobel Peace Prize nominee. She led LPN’s rescue operations — work documented in the award-winning film "Ghost Fleet" — freeing over 2,000 fishers trafficked to Indonesia.',
          media: mediaMap[253],
        },
        {
          name: 'Sompong Srakaew',
          role: 'Co-founder & Policy Advisor',
          quote: '"This work is my life."',
          body: 'A social worker who founded LPN in 2004 after leading a raid that freed 66 Myanmar workers from a shrimp-processing shed. His evidence work drove the 2008 amendment of the Anti-Trafficking in Persons Act and continues to shape Thai labour policy today.',
          media: mediaMap[254],
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
      <PageHero compact eyebrow={isThai ? 'เกี่ยวกับ LPN' : 'About LPN'} title={copy.hero.title}>
        <p className="t-label mt-8 text-white/70">{copy.hero.credit}</p>
      </PageHero>

      {/* INTRO + RENAME NOTE */}
      <Section tone="light" className="on-light">
        <Container>
          <div className="max-w-3xl">
            <p className="t-lede text-black/85">{copy.hero.intro}</p>
            <p className="t-lede mt-6 font-semibold text-black">{copy.hero.courage}</p>
            <p className="mt-8 border-l-2 border-brand-yellow pl-4 text-sm text-black/75 italic">
              {copy.hero.footnote}
            </p>
          </div>
        </Container>
      </Section>

      {/* WHY MIGRANTS */}
      <Section tone="paper" className="on-light">
        <Container>
          <SectionHeading eyebrow={copy.why.eyebrow} title={copy.why.title} />
          <div className="mt-8 max-w-3xl">
            {copy.why.paras.map((p) => (
              <p key={p.slice(0, 24)} className="t-lede mt-5 text-black/75">
                {p}
              </p>
            ))}
            <p className="mt-8 text-base font-bold text-black">{copy.why.prey}</p>
            <p className="t-label mt-4 text-black/70">{copy.why.credit}</p>
          </div>
        </Container>
      </Section>

      {/* HUMAN BEINGS ARE NOT FOR SALE */}
      <Section tone="dark" className="border-y border-white/10">
        <Container>
          <SectionHeading tone="light" title={copy.sale.title} />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {copy.sale.cards.map((c, i) => (
              <article key={c.title} className="glass-dark relative rounded p-6">
                <div className="text-3xl font-black text-brand-yellow">0{i + 1}</div>
                <h3 className="t-h3 mt-4 text-white">{c.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/70">{c.body}</p>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      {/* THEORY OF CHANGE */}
      <Section tone="light" className="on-light">
        <Container>
          <SectionHeading eyebrow={copy.theory.eyebrow} title={copy.theory.title} />
          <div className="mt-8 max-w-3xl">
            {copy.theory.paras.map((p) => (
              <p key={p.slice(0, 24)} className="t-lede mt-5 text-black/75">
                {p}
              </p>
            ))}
          </div>
        </Container>
      </Section>

      {/* THREE SERVICE AREAS */}
      <Section tone="paper" className="on-light">
        <Container>
          <SectionHeading eyebrow={copy.services.eyebrow} title={copy.services.title} />
          <div className="mt-10">
            {copy.services.items.map((s, i) => (
              <EditorialRow key={s.title} index={`0${i + 1}`} title={s.title} body={s.body} />
            ))}
          </div>
        </Container>
      </Section>

      {/* 15 YEARS — CRITICAL FOR SUCCESS */}
      <Section tone="dark" className="border-y border-white/10">
        <Container>
          <SectionHeading tone="light" title={copy.critical.title} />
          <ul className="mt-10 grid gap-4 md:grid-cols-2">
            {copy.critical.items.map((item) => (
              <li key={item.slice(0, 24)} className="glass-dark relative rounded p-6">
                <span className="absolute top-0 left-0 h-1.5 w-10 bg-brand-yellow" aria-hidden="true" />
                <p className="text-sm leading-relaxed text-white/85">{item}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* LEADERSHIP (LPN addition) */}
      <Section tone="light" className="on-light">
        <Container>
          <SectionHeading
            eyebrow={isThai ? 'ผู้นำองค์กร' : 'Leadership'}
            title={isThai ? 'นักสิทธิที่ทำงานข้างเดียวกับแรงงาน' : 'Activists who walk beside workers.'}
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {leaders.map((l) => (
              <article key={l.name} className="card card-marked flex flex-col p-8">
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
                <p className="text-lg font-bold text-black italic leading-snug">{l.quote}</p>
                <h3 className="t-h3 mt-4">{l.name}</h3>
                <div className="t-label mt-1.5 text-black/70">{l.role}</div>
                <p className="mt-4 text-sm leading-relaxed text-black/75">{l.body}</p>
              </article>
            ))}
          </div>
          <div className="mt-10">
            <ButtonLink href="/team" variant="ghostDark">
              {isThai ? 'พบทีมงานทั้งหมด' : 'Meet the full team'} →
            </ButtonLink>
          </div>
        </Container>
      </Section>

      {/* AWARDS (LPN addition) */}
      <Section tone="paper" className="on-light">
        <Container>
          <div className="grid gap-12 md:grid-cols-[1fr_2fr] md:items-start">
            <div>
              <h2 className="t-h2">{isThai ? 'รางวัลและการยอมรับ' : 'Awards & recognition'}</h2>
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

      {/* DONATE (live copy) */}
      <CtaBand
        heading={copy.donate.heading}
        body={copy.donate.body}
        actions={
          <>
            <ButtonLink href="/donate" variant="solidDark">
              {copy.donate.cta}
            </ButtonLink>
            <ButtonLink href="/services" variant="ghostDark">
              {isThai ? 'ดูบริการของเรา' : 'See our services'}
            </ButtonLink>
          </>
        }
      />
    </>
  )
}
