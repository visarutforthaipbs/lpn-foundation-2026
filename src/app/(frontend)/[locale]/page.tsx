import { getTranslations, setRequestLocale } from 'next-intl/server'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { getPage, getPosts } from '@/lib/api'
import { MediaImage } from '@/components/MediaImage'
import { buildMetadata } from '@/lib/seo'
import { HOTLINES, telHref } from '@/lib/content'
import { Container, Section, SectionHeading, StatBand, ButtonLink, CtaBand, Eyebrow, MarkLink } from '@/components/ui'

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
  // Content follows the live lpnfoundation.org site (verified 2026-09-30).
  const t = await getTranslations('home')
  const isThai = locale === 'th'
  const { docs: recentPosts } = await getPosts(locale, { limit: 3 })

  const sectionTitle = isThai ? 'LPN ทำงานอย่างไร' : 'How LPN works'
  const sectionSubtitle = isThai
    ? 'ป้องกันการค้ามนุษย์ ปฏิบัติการช่วยชีวิต และเครือข่ายแรงงาน'
    : 'Trafficking prevention, life saving rescue, and intelligence networks.'

  // Three pillars — copy verbatim from the live site.
  const pillars = isThai
    ? [
        {
          title: 'ป้องกันการค้ามนุษย์',
          body: 'LPN ได้ฝึกอบรมแรงงานและอาสาสมัครกว่าจำนวน 500 คนต่อปี เพื่อให้เข้าใจในเรื่องการข้ามแดนอย่างปลอดภัยและรวมไปถึงเรื่องสิทธิของแรงงาน และเรายังสามารถเข้าถึงแรงงานมากกว่า 500,000 คนผ่านโซเชียลมีเดีย เราได้ช่วยเหลือครอบครัวของแรงงานข้ามชาติโดยการทำลายวงจรความยากจนผ่านการเข้าถึงการศึกษา',
          cta: 'อ่านเพิ่มเติม',
          href: '/services',
        },
        {
          title: 'ปฏิบัติการช่วยชีวิตลูกเรือ',
          body: 'LPN ได้รับคำร้องเรียนจำนวนมากเกี่ยวกับแรงงานประมงที่ถูกละเมิดสิทธิในประเทศอินโดนีเซีย ทั้งการขู่เข็ญบังคับใช้แรงงาน การใช้แรงงานเด็ก การกักขังหน่วงเหนี่ยว และรวมไปถึงการค้ามนุษย์ LPN จึงได้ทำปฏิบัติการช่วยเหลือชีวิตลูกเรือประมงที่เรียกว่า “Indonesia Operation” หรือ “ภารกิจอินโดนีเซีย” ซึ่งถูกบันทึกเอาไว้ในภาพยนตร์สารคดีเรื่อง Ghost Fleet ที่ออกฉายครั้งแรกในปี 2019',
          cta: 'อ่านเพิ่มเติม',
          href: '/ghost-fleet',
        },
        {
          title: 'สร้างเครือข่ายของแรงงาน',
          body: 'กว่า 15 ปีที่ LPN ได้ทำงานกับกลุ่มแรงงานข้ามชาติ เราได้สร้างเครือข่ายอาสาสมัคร และนักปกป้องสิทธิ เพื่อช่วยในการส่งเสียงของแรงงาน อย่างเช่นการร้องเรียน หรือแม้กระทั่งรวบรวมหลักฐาน ซึ่งจะช่วยนำเสียงของแรงงานไปสู่ในระดับนโนบายและในระดับโลก',
          cta: 'อ่านเพิ่มเติม',
          href: '/services',
        },
      ]
    : [
        {
          title: 'Trafficking prevention',
          body: 'We train 500 migrants and volunteers per year on safe migration and labour rights and reach 500,000+ more through social media. We help migrant families break the cycle of poverty through education centers.',
          cta: 'Read about rights advocacy',
          href: '/services',
        },
        {
          title: 'Life saving rescue',
          body: 'We respond to distress calls and track down instances of forced labor, debt bondage, child labor, abuse, confinement and human trafficking. Our rescue mission was featured in the 2019 documentary film Ghost Fleet.',
          cta: 'Read about raids & rescue',
          href: '/ghost-fleet',
        },
        {
          title: 'Intelligence Network',
          body: 'Over 15 years we have built a trusted network of volunteers, watchdogs and activists that help provide critical intelligence. We share this evidence with a global network of partners to drive policy change.',
          cta: 'Read about labor rights promotion',
          href: '/services',
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
    ? '7 ใน 10 ของแรงงานประมงไทยมีลักษณะของการเป็น "แรงงานบังคับ"'
    : '7 out of 10 fishermen in Thailand show indicators of forced labour'

  const statSource = isThai
    ? 'จากรายงานที่ของโครงการ UN-ACT หรือกรอบความร่วมมือที่เกี่ยวข้องกับการต่อต้านการค้ามนุษย์ ปี 2019 ได้ระบุว่ากว่าร้อยละ 71 ของชาวประมง มีงการบังคับใช้แรงงานอย่างน้อย 1 อย่างขึ้นไปอย่างเช่น การอยู่ในสภาพแวดล้อมที่ถูกเอาเปรียบ (40%) การหลอกลวงเกี่ยวกับงาน (37%) หรือถูกเก็บเอกสารส่วนตัว (33%)'
    : 'UN-ACT Thailand Migration Report, 2019. 71% of fishers show 1 or more indicators of forced labor, such as abusive conditions (40%), deception about work (37%) or withholding of documents (33%)'

  const statCredit = isThai ? 'ภาพถ่ายโดย: Luke Duggleby' : 'Photo by: Luke Duggleby'

  // "What is modern day slavery?" cycle — copy verbatim from the live site.
  const slaverySteps = isThai
    ? [
        {
          title: 'อิสรภาพในราคา 30,000 บาท',
          body: '25,000 ถึง 30,000 บาท คือจำนวนเงินที่นายหน้าค้ามนุษย์ได้รับเมื่อนำแรงงานหนึ่งคนเข้าไปส่งนายจ้าง แม้ว่าจะฟังดูน่ารังเกียจแต่กลับเป็นธุรกิจขนาดใหญ่ที่ทำเงินมหาศาล',
        },
        {
          title: 'ถูกขังอยู่ในคุกลอยน้ำ',
          body: 'หลังจากถูกหลอกให้ไปทำงานบนเรือแรงงานประมงก็จะติดอยู่บนเรือที่ลอยอยู่กลางทะเล และไม่สามารถหนีไปไหนได้ และถูกบังคับให้ทำงาน คล้ายกับติดคุก',
        },
        {
          title: 'ติดคุก ตาย รอดชีวิต',
          body: 'หากมีแรงงานคนไหนที่ไม่เชื่อฟัง พวกเขาจะถูกจับขังไว้ในกรงเหล็ก หรือทิ้งไว้ในเกาะร้างของประเทศอินโดนีเซียน และบางคนถูกฆ่าทันที มีเพียงส่วนน้อยเท่านั้นที่รอดชีวิตมาได้',
        },
        {
          title: 'ตลาดค้ามนุษย์มือสอง',
          body: 'แม้ว่าแรงงานประมงจะสามารถหนีขึ้นฝั่งได้ แต่ก็มีขบวนการค้ามนุษย์อีกกลุ่มที่รออยู่บนฝั่ง เพื่อจับกุมและขายพวกเขาอีกครั้งอยู่เสมอ ๆ',
        },
      ]
    : [
        {
          title: '$1000 for your freedom',
          body: 'A human trafficker gets approximately $800 - $1000 for each worker they bring in, a gruesome yet lucrative business.',
        },
        {
          title: 'Trapped on a floating prison',
          body: 'Tricked onto the boat, the workers are trapped in a floating prison, forced to work, unable to escape.',
        },
        {
          title: 'Jail, death or rescue',
          body: 'Unruly slaves get imprisoned on remote Indonesian islands or killed. The lucky few are rescued.',
        },
        {
          title: 'Secondary trafficking markets',
          body: 'So many fishermen attempt to flee, traffickers wait on shore to capture and sell them all over again.',
        },
      ]

  const slaveryHope = isThai
    ? 'LPN ช่วยให้ความหวังกับแรงงานประมงที่ถูกเอาเปรียบ เพราะว่าจะมีคนช่วยเหลือพวกเขาเสมอ'
    : 'LPN gives fishermen everywhere hope someone will come for them'

  const slaveryQuote = isThai ? '“บริษัทไล่ล่าเราทั้งวันทั้งคืน”' : '"The company hunted us day and night"'
  const slaveryQuoteAttr = isThai ? '- ภาพยนตร์ Ghost Fleet' : '- Ghost Fleet film'

  // "Why is this happening?" — copy verbatim from the live site.
  const whyParas = isThai
    ? [
        'เนื่องจากการจับสัตว์ทะเลมาเกินไปทำให้จำนวนสัตว์ทะเลและระบบนิเวศของอ่าวไทยเสียหายอย่างหนัก และไม่เพียงพออีกต่อไปที่จะหล่อเลี้ยงความต้องการอีกต่อไปจึงทำให้บริษัทอาหารทะเลที่ยังต้องการที่จะรักษาผลกำไรไว้จำเป็นต้องส่งเรือไปไกลจากอ่าวไทย',
        'และเพราะสภาพการทำงานที่ยากลำบาก ห่างไกลจากบ้าน เนื่องจากออกไปในกลางมหาสมุทรของทะเลต่างประเทศ ทำให้เกิดสภาพการขาดแคลนแรงงานบนเรือประมงจำนวนมาก จึงต้องพึ่งพาขบวนการค้ามนุษย์ในการจัดหาแรงงานเพื่อนำมาใช้ในทำงานบนเรือ ซึ่งแรงงานบนเรือประมงเหล่านี้ก็ต้องทรมานทั้งจากสภาพการทำงานบนเรือที่เลวร้ายและออกทะเลติดต่อกันหลายปี',
        'ด้วยเครือข่าย “สีเทา ๆ ” แบบนี้บวกกับความไม่ชัดเจนในการจัดหาแรงงานโดยใช้ระบบนายหน้า ทำให้ผู้ที่เกี่ยวข้องในธุรกิจอาหารทะเลทั้งหลายทั้งโรงงาน ผู้นำเข้า ผู้ส่งออก บริษัท เจ้าหน้าที่รัฐ มีข้ออ้างในการปฏิเสธการรับผิดชอบหรือแม้กระทั่งการปฏิเสธการรับรู้',
      ]
    : [
        'Overfishing in the Gulf of Thailand has depleted one of the world’s most diverse and bountiful ecosystems. To maintain their profits, fishing companies have forced boats further from shore and for longer periods of time.',
        'Unable to recruit for this brutal work, huge fleets of unregulated boats rely on human traffickers and slave labor to sustain their operations, shuffling them between boats and keeping them out at sea for years at a time.',
        'An intentionally-muddy supply chain gives processing plants, exporters, importers, corporations and government officials plausible deniability.',
      ]

  const whyDemand = isThai
    ? 'ด้วยเหตุนี้เราจึงจำเป็นที่จะต้องเรียกร้องความโปร่งใสในห่วงโซ่อุปทานของธุรกิจที่เกี่ยวข้องกับอาหารทะเลนี้เพื่อที่จะหยุดการมีอยู่ของแรงงานทาส'
    : 'We must demand transparency in the supply chain to eradicate slave labor.'

  // "Now that you know, what will you do?" actions — copy verbatim from the live site.
  const actions = isThai
    ? [
        {
          title: 'ถามหาที่มาอาหารทะเลของคุณ',
          body: 'บริษัทคิดว่าผู้คนไม่สนใจว่าใครจับปลาของพวกเขา กดดันให้เครือร้านขายของชำ ร้านอาหาร และอาหารแมวของคุณให้คำมั่นว่าห่วงโซ่อุปทานของพวกเขาจะปราศจากทาส',
          note: 'ดูวิดีโอ: Better Seafood Choices',
          href: '/services',
        },
        {
          title: 'บริจาคให้กับ LPN',
          body: 'สามารถช่วย LPN ให้ทำงานได้มากขึ้น เข้าถึงแรงงานได้มากขึ้น ด้วยการสนับสนุนและบริจาคเพราะนั้นจะช่วยให้เราทำงานเพื่อป้องกันการค้ามนุษย์ได้อย่างกว้างมากขึ้น',
          note: '',
          href: '/donate',
        },
        {
          title: 'ร่วมเป็น Partner กับเราในการเปลี่ยนแปลงสังคม',
          body: 'LPN มองหาเพื่อน ๆ และพันธมิตรใหม่ ๆ อยู่เสมอเพื่อทำงานกับเรา ไม่ว่าจะเป็นผู้มีส่วนเกี่ยวข้องด้านนโยบาย นักกิจกรรม กลุ่มNGOs ชุมชนท้องถิ่น สื่อสารมวลชน มหาวิทยาลัย หรือบริษัทเอกชน ขอเพียงแค่มีความต้องการที่จะสนับสนุนเรื่องสิทธิของแรงงาน',
          note: '',
          href: '/projects',
        },
      ]
    : [
        {
          title: 'Ask where your seafood comes from',
          body: 'Corporations think people don’t care who catches their fish. Pressure your grocery chain, restaurant and cat food brand to pledge that their supply chain is slavery-free.',
          note: 'Watch video: Better Seafood Choices',
          href: '/services',
        },
        {
          title: 'Donate to LPN',
          body: 'Help us expand our reach, follow more leads and launch new preventative programs. With your help, fewer vulnerable people will fall into the predatory hands of human traffickers.',
          note: '',
          href: '/donate',
        },
        {
          title: 'Partner with us for change',
          body: 'We actively seek partnerships with policy makers, activists, NGOs, community based organizations, journalists, universities and corporations who want to advocate for labour rights and tell our story far and wide.',
          note: '',
          href: '/projects',
        },
      ]

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
              <p className="mt-3 text-xs leading-relaxed font-semibold text-brand-yellow/90">{statSource}</p>
              <p className="mt-2 text-[10px] font-bold tracking-widest text-white/45 uppercase">{statCredit}</p>
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

      {/* ------------------------------------------------------- HOW LPN WORKS */}
      <Section tone="light" className="contain-pillars on-light">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-8">
            <SectionHeading title={sectionTitle} lede={sectionSubtitle} />
            <ButtonLink href="/services" variant="ghostDark">
              {isThai ? 'ดูบริการทั้งหมด' : 'See all services'} →
            </ButtonLink>
          </div>

          <div className="mt-12">
            {pillars.map((item, idx) => (
              <article key={item.title} className="grid gap-x-10 gap-y-4 border-t border-black/15 py-10 md:grid-cols-[auto_1fr_auto]">
                <div className="text-xs font-black tracking-[0.3em] text-black/35 uppercase md:pt-1.5">
                  0{idx + 1}
                </div>
                <div>
                  <h3 className="t-h3">{item.title}</h3>
                  <p className="mt-3 max-w-2xl text-base leading-relaxed text-black/70">{item.body}</p>
                </div>
                <div className="flex items-start">
                  <MarkLink href={item.href} className="text-black">
                    {item.cta} →
                  </MarkLink>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      {recentPosts.length > 0 && (
        <Section tone="paper" className="on-light">
          <Container>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeading
                title={isThai ? 'ข่าวสารและเรื่องเล่าจาก LPN' : 'Latest from LPN'}
                lede={isThai ? 'อ่านบทความและเรื่องราวที่เผยแพร่ล่าสุดจากทีมงาน' : 'Recent articles and stories from the team.'}
              />
              <ButtonLink href="/blog" variant="ghostDark">{isThai ? 'ดูบทความทั้งหมด' : 'View all articles'} →</ButtonLink>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {recentPosts.map((post) => (
                <Link key={post.id} href={`/post/${post.slug}`} className="card group flex flex-col overflow-hidden">
                  <div className="aspect-video overflow-hidden bg-black/5">
                    {post.coverImage && typeof post.coverImage !== 'number' && (
                      <MediaImage media={post.coverImage} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width:768px) 100vw, 33vw" />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    {post.publishedAt && <time dateTime={post.publishedAt} className="t-label text-black/50">{new Date(post.publishedAt).toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' })}</time>}
                    <h3 className="t-h3 mt-3">{post.title}</h3>
                    {post.excerpt && <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-black/70">{post.excerpt}</p>}
                    <span className="link-mark mt-auto pt-6">{isThai ? 'อ่านต่อ' : 'Read story'} →</span>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* ---------------------------------------- WHAT IS MODERN DAY SLAVERY */}
      <Section tone="dark" className="border-y border-white/10">
        <Container>
          <SectionHeading
            tone="light"
            eyebrow={isThai ? 'เส้นทางของการค้ามนุษย์' : 'The trafficking cycle'}
            title={isThai ? 'อะไรคือแรงงานทาสในสมัยนี้?' : 'What is modern day slavery?'}
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {slaverySteps.map((s, i) => (
              <article key={s.title} className="glass-dark relative rounded p-6">
                <div className="text-3xl font-black text-brand-yellow">0{i + 1}</div>
                <h3 className="t-h3 mt-4 text-white">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/70">{s.body}</p>
              </article>
            ))}
          </div>

          <div className="mt-14 grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="t-lede text-white/85">{slaveryHope}</p>
              <figure className="mt-8 border-l-2 border-brand-yellow pl-6">
                <blockquote className="text-xl font-bold text-brand-yellow italic">{slaveryQuote}</blockquote>
                <figcaption className="t-label mt-3 text-white/55">{slaveryQuoteAttr}</figcaption>
              </figure>
            </div>
            <div>
              <h3 className="t-h2 text-white">{isThai ? 'เรื่องแบบนี้เกิดขึ้นได้อย่างไร' : 'Why is this happening?'}</h3>
              {whyParas.map((p) => (
                <p key={p.slice(0, 24)} className="mt-5 text-sm leading-relaxed text-white/75">
                  {p}
                </p>
              ))}
              <p className="mt-6 border-l-2 border-brand-yellow pl-4 text-base font-bold text-white">
                {whyDemand}
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* -------------------------------------------- NOW THAT YOU KNOW — ACTIONS */}
      <Section tone="light" className="on-light">
        <Container>
          <SectionHeading
            title={isThai ? 'คุณช่วยอะไรได้บ้าง' : 'Now that you know, what will you do?'}
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {actions.map((a, i) => (
              <article key={a.title} className={`card flex flex-col p-8 ${i === 1 ? 'card-marked' : ''}`}>
                <h3 className="t-h3">{a.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-black/70">{a.body}</p>
                {a.note && <p className="mt-4 text-xs font-bold tracking-widest text-black/50 uppercase">{a.note}</p>}
                <div className="mt-auto pt-8">
                  <MarkLink href={a.href} className="text-black">
                    {isThai ? 'อ่านเพิ่มเติม' : 'Find out more'} →
                  </MarkLink>
                </div>
              </article>
            ))}
          </div>
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
                ? 'แจ้งเรื่อง ขอความช่วยเหลือ หรือขอข้อมูลเกี่ยวกับกฎหมายแรงงานและการลงทะเบียนที่เกี่ยวข้องแรงงาน โปรดโทรหาเราทันที (บริการช่วยเหลือฟรีและเก็บเป็นความลับ)'
                : 'To report a case, request assistance, or get information on labor laws and government registration, call our hotlines immediately. Confidential and supportive.'
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
    </>
  )
}
