import { setRequestLocale } from 'next-intl/server'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { getPosts, getMediaByIds, getImpactMetrics } from '@/lib/api'
import { buildMetadata } from '@/lib/seo'
import { telHref } from '@/lib/content'
import { getHelpChannels } from '@/lib/help-channels'
import { ButtonLink, Container, Section, SectionHeading } from '@/components/ui'
import { MediaImage } from '@/components/MediaImage'

const REPORT_2024 = 'https://d90624d9-477d-4d0e-8335-c4795fa13a13.usrfiles.com/ugd/d90624_78b68c9d8aff4a41856fc475cd1d5c37.pdf'
const RIGHT_GUIDE = 'https://www.lpnrightguide.site/'

export async function generateMetadata(props: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await props.params
  return buildMetadata({
    locale,
    path: '',
    title: locale === 'th' ? 'LPN | สิทธิที่เข้าถึงได้ การคุ้มครองที่ยั่งยืน' : 'LPN | Rights within reach. Protection that lasts.',
    description: locale === 'th'
      ? 'LPN เคียงข้างแรงงานข้ามชาติและครอบครัวในประเทศไทย เพื่อให้เข้าถึงความช่วยเหลือและสร้างระบบที่ปลอดภัยขึ้น'
      : 'LPN helps migrant workers and families in Thailand access protection today and builds safer systems for tomorrow.',
  })
}

export default async function HomePage(props: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await props.params
  setRequestLocale(locale)
  const th = locale === 'th'

  const [{ docs: posts }, hotlines, mediaMap, publishedMetrics] = await Promise.all([
    getPosts(locale, { limit: 3 }),
    getHelpChannels(locale),
    getMediaByIds([224, 237, 229, 253, 9]),
    getImpactMetrics(locale),
  ])

  const streams = th ? [
    {
      n: '01',
      id: 'respond',
      title: 'ตอบสนองและคุ้มครอง',
      category: 'ช่วยเหลือตรง',
      body: 'ช่วยแรงงานและครอบครัวเมื่อเผชิญปัญหาค่าจ้าง เอกสาร สุขภาพ ความปลอดภัย หรือการแสวงหาประโยชน์ และประสานช่องทางช่วยเหลือที่เหมาะสม',
      media: mediaMap[224],
      alt: 'พิธีเปิดศูนย์ช่วยเหลือแรงงานประมงกับผู้แทนหลายหน่วยงาน',
    },
    {
      n: '02',
      id: 'learn',
      title: 'เสริมความรู้และชุมชน',
      category: 'การศึกษาและชุมชน',
      body: 'สร้างความรู้เรื่องสิทธิ สนับสนุนเยาวชนและครอบครัว และทำงานร่วมกับเครือข่ายแรงงาน เพื่อป้องกันปัญหาก่อนจะรุนแรงขึ้น',
      media: mediaMap[237],
      alt: 'ผู้หญิงและเด็กนั่งอยู่ด้วยกันในบ้าน',
    },
    {
      n: '03',
      id: 'change',
      title: 'เปลี่ยนระบบ',
      category: 'ขับเคลื่อนนโยบาย',
      body: 'นำประสบการณ์ภาคสนามและเสียงแรงงานมาสร้างหลักฐาน ทำงานกับพันธมิตร และผลักดันระบบที่คุ้มครองคนได้ดีขึ้น',
      media: mediaMap[229],
      alt: 'พิธีเปิดศูนย์ฝึกอบรมและฟื้นฟูโดยผู้แทนหลายหน่วยงาน',
    },
  ] : [
    {
      n: '01',
      id: 'respond',
      title: 'Respond and protect',
      category: 'Casework',
      body: 'Help workers and families facing problems with pay, documents, health, safety, or exploitation, and connect them with appropriate support.',
      media: mediaMap[224],
      alt: 'Opening ceremony of a fishermen’s assistance centre',
    },
    {
      n: '02',
      id: 'learn',
      title: 'Learn and strengthen communities',
      category: 'Education & Community',
      body: 'Build rights knowledge, support young people and families, and work with worker networks so problems can be prevented earlier.',
      media: mediaMap[237],
      alt: 'A woman and child sitting together at home',
    },
    {
      n: '03',
      id: 'change',
      title: 'Change systems',
      category: 'Systems Change',
      body: 'Turn field experience and worker voice into evidence, partnerships, and practical changes to the systems people rely on.',
      media: mediaMap[229],
      alt: 'Opening ceremony of a training and rehabilitation centre',
    },
  ]

  const featuredMetrics = publishedMetrics.filter((metric) => metric.featured).slice(0, 3)
  const fallbackMetrics = th ? [
    { value: '135', label: 'กรณีช่วยเหลือแรงงาน', detail: 'มีผู้ได้รับประโยชน์ 707 คน' },
    { value: '832', label: 'แรงงานได้รับการอบรม', detail: 'ความรู้และการป้องกัน' },
    { value: '80', label: 'เยาวชนในโครงการ', detail: 'การศึกษาและการสนับสนุน' },
  ] : [
    { value: '135', label: 'worker-assistance cases', detail: 'benefiting 707 people' },
    { value: '832', label: 'workers trained', detail: 'rights knowledge and prevention' },
    { value: '80', label: 'young people supported', detail: 'education and support project' },
  ]
  const metrics = featuredMetrics.length ? featuredMetrics.map((metric) => ({
    value: metric.value,
    label: metric.label,
    detail: `${metric.unit} · ${metric.periodLabel}`,
    source: typeof metric.sourceReport === 'object' && metric.sourceReport ? metric.sourceReport.sourceURL : metric.sourceURL,
  })) : fallbackMetrics.map((metric) => ({ ...metric, source: REPORT_2024 }))

  const steps = th ? [
    ['ฟังและช่วยเหลือ', 'รับฟังปัญหา ประเมินความต้องการ และประสานความช่วยเหลือที่ปลอดภัยและทันท่วงที'],
    ['เรียนรู้ร่วมกับชุมชน', 'แบ่งปันความรู้เรื่องสิทธิ และรับฟังรูปแบบปัญหาที่เกิดขึ้นซ้ำในชุมชน'],
    ['สร้างหลักฐานเพื่อเปลี่ยนระบบ', 'ใช้ข้อค้นพบที่ตรวจสอบได้ในการทำงานกับพันธมิตร ผู้กำหนดนโยบาย และเวทีระหว่างประเทศ'],
  ] : [
    ['Listen and respond', 'Understand the problem and connect people with safe, appropriate support.'],
    ['Learn with communities', 'Share rights knowledge and identify recurring systemic barriers.'],
    ['Build evidence for change', 'Use verified findings with partners, policy makers, and international forums.'],
  ]

  return <>
    {/* ------------------------------------------------------------- HERO */}
    <section className="relative overflow-hidden bg-black text-white">
      {/* Authentic field photography backdrop */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/trawler-hero.jpg"
          alt={th ? 'การปฏิบัติงานภาคสนามคุ้มครองสิทธิแรงงานประมง LPN' : 'LPN frontline operations protecting fisher rights'}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-35 brightness-90 contrast-105"
        />
        {/* Protective gradient scrim ensuring 100% WCAG AAA readability */}
        <div className="absolute inset-0 bg-linear-to-r from-black via-black/85 to-black/60 pointer-events-none" />
        <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-black/40 pointer-events-none" />
      </div>

      <div className="pointer-events-none absolute right-0 top-0 z-1 h-full w-[42%] border-l border-white/10 bg-[linear-gradient(135deg,transparent_0%,rgba(255,199,0,0.08)_100%)]" aria-hidden="true" />

      <Container className="relative z-10 py-20 md:py-28 lg:py-36">
        <p className="eyebrow text-brand-yellow">{th ? 'มูลนิธิเครือข่ายส่งเสริมคุณภาพชีวิตแรงงาน' : 'Labour Rights Promotion Network Foundation'}</p>
        <h1 className="t-display mt-7 max-w-5xl text-white">
          {th ? 'สิทธิที่เข้าถึงได้' : 'Rights within reach.'}
          <span className="block text-brand-yellow">{th ? 'การคุ้มครองที่ยั่งยืน' : 'Protection that lasts.'}</span>
        </h1>
        <p className="t-lede mt-8 max-w-2xl text-white/90">
          {th
            ? 'LPN เคียงข้างแรงงานข้ามชาติและครอบครัวในประเทศไทย เพื่อให้เข้าถึงความปลอดภัย การรักษาพยาบาล การศึกษา และสิทธิที่ควรได้รับ เราช่วยเหลือเมื่อเกิดปัญหา และนำสิ่งที่เรียนรู้จากชุมชนไปสร้างการเปลี่ยนแปลงระยะยาว'
            : 'LPN works alongside migrant workers and families in Thailand to access safety, healthcare, education, and fair treatment. We respond when someone needs help and use what we learn to build lasting change.'}
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/get-help" variant="primary" className="sm:min-w-48">{th ? 'ขอความช่วยเหลือ' : 'Get help'}</ButtonLink>
          <ButtonLink href="/donate" variant="ghostLight" className="sm:min-w-48">{th ? 'ร่วมสนับสนุน' : 'Support the work'}</ButtonLink>
        </div>
        <div className="mt-9 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 text-sm text-white/75">
          <p>{th ? 'ต้องการติดต่อโดยตรง? ' : 'Need to speak with someone? '}
            <a className="font-semibold text-white underline decoration-brand-yellow underline-offset-4" href={telHref(hotlines[0]?.phone || '034-434-046')}>
              {th ? 'โทร LPN ' : 'Call LPN '}{hotlines[0]?.phone || '034-434-046'}
            </a>
          </p>
        </div>
      </Container>
    </section>

    {/* ------------------------------------------------- FOR WORKERS & FAMILIES */}
    <Section tone="yellow" tight>
      <Container className="grid gap-7 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p className="t-label uppercase">{th ? 'สำหรับแรงงานและครอบครัว' : 'For workers and families'}</p>
          <h2 className="t-h3 mt-2">{th ? 'มีปัญหาอยู่ หรืออยากรู้สิทธิของตัวเอง?' : 'Facing a problem, or want to know your rights?'}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-black/80">{th
            ? 'ติดต่อ LPN โดยตรง หรือค้นหาข้อมูลเรื่องค่าจ้าง เอกสาร ความปลอดภัย สุขภาพ และครอบครัวในคู่มือรู้สิทธิ'
            : 'Contact LPN directly, or explore practical information about pay, documents, safety, health, and family in the Rights Guide.'}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
          <ButtonLink href="/get-help" variant="solidDark">{th ? 'ติดต่อขอความช่วยเหลือ' : 'Contact LPN'}</ButtonLink>
          <ButtonLink href={RIGHT_GUIDE} variant="ghostDark">{th ? 'รู้สิทธิ ติดกระเป๋า' : 'Explore the Rights Guide'}</ButtonLink>
        </div>
      </Container>
    </Section>

    {/* --------------------------------------------- THREE WORKSTREAMS (PILLARS) */}
    <Section tone="light"><Container>
      <SectionHeading eyebrow={th ? 'งานของเรา' : 'Our work'} title={th ? 'ช่วยเหลือวันนี้ ป้องกันปัญหาในวันหน้า' : 'Help today. Prevent harm tomorrow.'} lede={th ? 'งานทั้งสามด้านเชื่อมกัน แต่ละด้านเริ่มจากความต้องการและเสียงของแรงงาน' : 'Three connected streams begin with workers’ needs and voices.'} />

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {streams.map((s) => (
          <article key={s.id} className="group flex flex-col border border-black/15 bg-paper transition-all hover:border-black hover:shadow-md">
            {s.media && (
              <div className="relative aspect-16/10 w-full overflow-hidden bg-black/10 border-b border-black/10">
                <MediaImage
                  media={s.media}
                  alt={s.alt}
                  sizes="(min-width: 1024px) 33vw, 100vw"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 bg-black text-brand-yellow px-2.5 py-1 text-xs font-black tracking-wider uppercase">
                  {s.n} / {s.category}
                </div>
              </div>
            )}
            <div className="flex flex-1 flex-col p-6 sm:p-7">
              <h3 className="t-h3">{s.title}</h3>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-black/80">{s.body}</p>
              <Link href={`/our-work#${s.id}`} className="link-mark mt-7 self-start text-black">
                {th ? 'ดูงานด้านนี้' : 'Explore this work'} →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </Container></Section>

    {/* --------------------------------------------- CASE TO CHANGE + LEADERSHIP */}
    <Section tone="dark"><Container>
      <SectionHeading
        eyebrow={th ? 'จากกรณีสู่การเปลี่ยนแปลง' : 'From a case to wider change'}
        title={th ? 'ประสบการณ์จริงช่วยให้เราเห็นจุดที่ระบบต้องเปลี่ยน' : 'Field experience reveals where systems need to change.'}
        tone="light"
      />

      <div className="mt-12 grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div>
          <ol className="grid gap-6">
            {steps.map(([title, body], i) => (
              <li key={title} className="border-l-2 border-brand-yellow pl-6">
                <span className="t-label text-brand-yellow">0{i + 1}</span>
                <h3 className="t-h3 mt-2 text-white">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/80">{body}</p>
              </li>
            ))}
          </ol>
          <p className="mt-8 text-sm text-white/70">
            {th
              ? 'ไม่ใช่ทุกกรณีจะนำไปสู่การเปลี่ยนแปลงเชิงนโยบายโดยตรง แต่การทำงานภาคสนามช่วยให้ LPN เห็นปัญหาที่ต้องแก้ไข'
              : 'Not every case leads directly to policy change. Fieldwork helps LPN understand which barriers need attention.'}
          </p>
        </div>

        {/* Leadership documentary portrait & statement */}
        <div className="border border-white/15 bg-white/5 p-6 sm:p-8 backdrop-blur-xs">
          {mediaMap[253] && (
            <div className="relative aspect-16/10 w-full overflow-hidden border border-white/10 bg-black/40">
              <MediaImage
                media={mediaMap[253]}
                alt={th ? 'ปฏิมา ตั้งปรัชญากูล ผู้อำนวยการ LPN' : 'Patima Tungpuchayakul, LPN Executive Director'}
                sizes="(min-width: 1024px) 30vw, 100vw"
                className="h-full w-full object-cover"
              />
            </div>
          )}
          <blockquote className="mt-6 border-l-2 border-brand-yellow pl-4">
            <p className="text-base font-semibold leading-relaxed text-white italic">
              {th ? '“เป้าหมายของฉันคือการช่วยชีวิตคน”' : '“My goal is to save lives.”'}
            </p>
            <cite className="mt-4 block not-italic">
              <span className="block font-bold text-white text-sm">
                {th ? 'ปฏิมา ตั้งปรัชญากูล' : 'Patima Tungpuchayakul'}
              </span>
              <span className="block text-xs text-white/70">
                {th ? 'ผู้ร่วมก่อตั้งและผู้อำนวยการ LPN · ผู้ได้รับการเสนอชื่อชิงรางวัลโนเบลสันติภาพ 2017' : 'Co-Founder & Director, LPN · 2017 Nobel Peace Prize Nominee'}
              </span>
            </cite>
          </blockquote>
        </div>
      </div>
    </Container></Section>

    {/* --------------------------------------------------------- DATED EVIDENCE */}
    <Section tone="paper"><Container>
      <SectionHeading
        eyebrow={th ? 'หลักฐานที่มีช่วงเวลา' : 'Dated evidence'}
        title={featuredMetrics.length ? (th ? 'ผลการทำงานที่ตรวจทานแล้ว' : 'Reviewed results') : (th ? 'ผลการทำงานปี 2024' : 'LPN’s 2024 results')}
        lede={featuredMetrics.length ? (th ? 'ตัวเลขแต่ละชุดมีนิยาม ช่วงเวลา และแหล่งที่มาในหน้ารายงาน' : 'Each figure has a definition, period, and source in Impact & Reports.') : (th ? 'ตัวเลขแต่ละชุดนับคนละสิ่ง และมาจากรายงานประจำปีของ LPN' : 'Each number measures something different and comes from LPN’s annual report.')}
      />

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
        <div>
          <div className="grid gap-4 sm:grid-cols-3">
            {metrics.map((m) => (
              <div key={m.value} className="border-t-4 border-brand-yellow bg-white p-6 sm:p-7 shadow-xs">
                <strong className="block text-4xl sm:text-5xl font-black tracking-tight text-black">{m.value}</strong>
                <p className="mt-3 text-base sm:text-lg font-bold text-black">{m.label}</p>
                <p className="mt-1.5 text-xs sm:text-sm text-black/70">{m.detail}</p>
                {featuredMetrics.length > 0 && m.source && <a href={m.source} className="mt-4 inline-block text-xs font-bold underline underline-offset-4">{th ? 'ดูแหล่งที่มา' : 'View source'}</a>}
              </div>
            ))}
          </div>
          {featuredMetrics.length === 0 && <p className="mt-6 text-sm text-black/75">
            {th ? 'ช่วงเวลา: ปี 2024 · ที่มา: รายงานประจำปี LPN เผยแพร่ปี 2025' : 'Period: 2024 · Source: LPN annual report, published in 2025'}{' · '}
            <a href={REPORT_2024} className="font-bold underline decoration-brand-yellow underline-offset-4" target="_blank" rel="noopener noreferrer">
              {th ? 'อ่านรายงานต้นฉบับ (PDF)' : 'Read the source report (PDF)'}
            </a>
          </p>}
          <div className="mt-8">
            <ButtonLink href="/impact" variant="solidDark">
              {th ? 'ดูผลการทำงานและรายงานทั้งหมด' : 'Explore impact and reports'}
            </ButtonLink>
          </div>
        </div>

        {/* Historical public Wix project image; recheck reuse approval before domain cutover. */}
        {mediaMap[9] && (
          <figure className="border border-black/10 bg-white p-4 shadow-xs">
            <div className="relative aspect-4/3 w-full overflow-hidden bg-black/5">
              <MediaImage
                media={mediaMap[9]}
                alt={th ? 'ผู้แทนหลายหน่วยงานในงานเปิดโครงการ LPN' : 'Representatives at an LPN project launch'}
                sizes="(min-width: 1024px) 360px, 100vw"
                className="h-full w-full object-cover"
              />
            </div>
            <figcaption className="mt-3 text-xs leading-relaxed text-black/70">
              {th
                ? 'ภาพจากงานเปิดโครงการของ LPN ในอดีต'
                : 'A historical LPN project launch.'}
            </figcaption>
          </figure>
        )}
      </div>
    </Container></Section>

    {/* --------------------------------------------------------- RECENT UPDATES */}
    <Section tone="light"><Container>
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <SectionHeading
          eyebrow={th ? 'เรื่องล่าสุด' : 'Recent updates'}
          title={th ? 'ข่าวและเรื่องราวจากงานของเรา' : 'News from the work'}
        />
        <Link href="/blog" className="link-mark self-start text-black">
          {th ? 'ดูข่าวทั้งหมด' : 'All updates'} →
        </Link>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {posts.map((post) => (
          <Link
            href={`/post/${post.slug}`}
            key={post.id}
            className="group flex flex-col border border-black/15 bg-white transition-all hover:border-black hover:shadow-md"
          >
            {post.coverImage && (
              <div className="relative aspect-16/10 w-full overflow-hidden bg-black/5 border-b border-black/10">
                <MediaImage
                  media={post.coverImage}
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            )}
            <div className="flex flex-1 flex-col p-6">
              {post.publishedAt && (
                <time dateTime={post.publishedAt} className="t-label text-black/70">
                  {new Date(post.publishedAt).toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' })}
                </time>
              )}
              <h3 className="t-h3 mt-3 group-hover:text-black line-clamp-2">{post.title}</h3>
              {post.excerpt && (
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-black/75">{post.excerpt}</p>
              )}
              <span className="link-mark mt-auto pt-6 text-black">{th ? 'อ่านต่อ' : 'Read story'} →</span>
            </div>
          </Link>
        ))}
      </div>
    </Container></Section>

    {/* ------------------------------------------------------- SUPPORT CTA BAND */}
    <Section tone="dark"><Container className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
      <SectionHeading
        eyebrow={th ? 'ร่วมสร้างการเปลี่ยนแปลง' : 'Support the work'}
        title={th ? 'ช่วยให้การคุ้มครองเข้าถึงคนได้มากขึ้น' : 'Help protection reach more people.'}
        lede={th ? 'การสนับสนุนของคุณช่วยให้งานช่วยเหลือ การศึกษา และการสร้างหลักฐานดำเนินต่อไปได้' : 'Support helps sustain direct assistance, education, and evidence-building.'}
        tone="light"
      />
      <ButtonLink href="/donate" variant="primary">{th ? 'ร่วมสนับสนุน LPN' : 'Support LPN'}</ButtonLink>
    </Container></Section>
  </>
}
