import { setRequestLocale } from 'next-intl/server'
import { dateLocale, isDraftLocale } from '@/i18n/locales'
import Image from 'next/image'
import { GlobeHemisphereEast } from '@phosphor-icons/react/ssr'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { getImpactMetrics, getPosts, getReports, getSiteMedia } from '@/lib/api'
import { MediaImage } from '@/components/MediaImage'
import { buildMetadata } from '@/lib/seo'
import { ButtonLink, Container, Section, SectionHeading } from '@/components/ui'
import { ReportLibrary } from '@/components/ReportLibrary'
import { tx, draftDict } from '@/i18n/tx'
import { TxProvider } from '@/i18n/tx-client'

const REPORT_2024 = 'https://d90624d9-477d-4d0e-8335-c4795fa13a13.usrfiles.com/ugd/d90624_78b68c9d8aff4a41856fc475cd1d5c37.pdf'
const FISHER_HEALTH_SLUG = 'เปิดตัวรายงาน-การยกระดับคุณภาพชีวิตแรงงานประมงในด้านการเข้าถึงบริการสาธารณสุขและสิทธิทางสุขภาพ'

export async function generateMetadata(props: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await props.params
  return buildMetadata({
    locale,
    path: '/impact',
    title: tx(locale, 'ผลการทำงานและรายงาน — LPN', 'Impact & Reports — LPN'),
    description: tx(locale, 'ดูผลการทำงานที่มีช่วงเวลาและแหล่งอ้างอิง รวมถึงรายงานและงานวิจัยของ LPN', 'Explore dated results, methods, annual reports, and field research from LPN.'),
  })
}

export default async function ImpactPage(props: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await props.params
  setRequestLocale(locale)
  const [{ docs: publications }, reviewedMetrics, reports, mediaMap] = await Promise.all([
    getPosts(locale, { categorySlug: 'publications', limit: 12 }),
    getImpactMetrics(locale),
    getReports(locale),
    getSiteMedia(),
  ])
  const metrics = tx(locale, [
    { value: '135', unit: 'กรณี', label: 'กรณีช่วยเหลือแรงงาน', definition: 'จำนวนกรณีช่วยเหลือแรงงานที่ LPN รายงานในปี 2024' },
    { value: '707', unit: 'คน', label: 'ผู้ได้รับประโยชน์', definition: 'จำนวนคนที่ได้รับประโยชน์จากกรณีช่วยเหลือแรงงาน 135 กรณี' },
    { value: '832', unit: 'คน', label: 'แรงงานได้รับการอบรม', definition: 'จำนวนแรงงานที่ LPN รายงานว่าเข้าร่วมการอบรม' },
    { value: '80', unit: 'คน', label: 'เยาวชนในโครงการ', definition: 'จำนวนเยาวชนในโครงการด้านการศึกษาและการสนับสนุน' },
  ], [
    { value: '135', unit: 'cases', label: 'worker-assistance cases', definition: 'Worker-assistance cases reported by LPN for 2024.' },
    { value: '707', unit: 'people', label: 'people benefiting', definition: 'People benefiting from those 135 worker-assistance cases.' },
    { value: '832', unit: 'workers', label: 'workers trained', definition: 'Workers reported by LPN as having received training.' },
    { value: '80', unit: 'youth', label: 'young people supported', definition: 'Young people in an education and support project.' },
  ])

  return <>
    <section className="relative overflow-hidden bg-black text-white">
      {/* Authentic field photography backdrop */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/learning-center.jpg"
          alt={tx(locale, 'การดำเนินงานและศูนย์การเรียนรู้ LPN', 'LPN learning center and evidence operations')}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-70"
        />
        <div className="absolute inset-0 bg-linear-to-r from-black via-black/75 to-black/10 pointer-events-none" />
        <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-black/40 pointer-events-none" />
      </div>

      <Container className="relative z-10 py-16 md:py-24">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-yellow/15 border border-current/30 text-brand-yellow">
            <GlobeHemisphereEast size={20} aria-hidden="true" />
          </div>
          <p className="eyebrow text-white/70">{tx(locale, 'ผลการทำงานและรายงาน', 'Impact & Reports')}</p>
        </div>
        <h1 className="t-display mt-6 max-w-5xl text-white">{tx(locale, 'ดูหลักฐาน พร้อมช่วงเวลาและที่มา', 'Evidence with dates and sources.')}</h1>
        <p className="t-lede mt-7 max-w-3xl text-white/80">{tx(locale, 'ตัวเลขผลการทำงานบอกว่า LPN ทำอะไรและเข้าถึงใคร งานวิจัยช่วยอธิบายปัญหาในระบบ ทั้งสองอย่างสำคัญ แต่ไม่ใช่สิ่งเดียวกัน', 'Results show what LPN did and whom it reached. Research describes wider conditions. Both matter, but they measure different things.')}</p>
      </Container>
    </section>

    {reviewedMetrics.length > 0 && <Section tone="paper"><Container>
      <SectionHeading eyebrow={tx(locale, 'ข้อมูลที่บรรณาธิการตรวจทาน', 'Reviewed metrics')} title={tx(locale, 'ตัวเลขพร้อมนิยามและแหล่งที่มา', 'Figures with definitions and sources')} />
      <div className="mt-10 grid gap-5 md:grid-cols-2">{reviewedMetrics.map((metric) => {
        const source = typeof metric.sourceReport === 'object' && metric.sourceReport ? metric.sourceReport.sourceURL : metric.sourceURL
        return <article key={metric.id} className="border-t-4 border-current bg-white p-6">
          <p className="text-3xl font-bold">{metric.value} <span className="text-base">{metric.unit}</span></p>
          <h3 className="t-h3 mt-4">{metric.label}</h3>
          <p className="mt-2 text-sm font-semibold">{metric.periodLabel}</p>
          <p className="mt-4 text-sm leading-relaxed text-black/75">{metric.definition}</p>
          {metric.method && <p className="mt-3 text-sm leading-relaxed text-black/70">{metric.method}</p>}
          {source && <a href={source} className="link-mark mt-5 inline-block text-black">{tx(locale, 'ดูแหล่งที่มา', 'View source')} →</a>}
        </article>
      })}</div>
    </Container></Section>}

    {reports.length > 0 && <Section tone="light"><Container>
      <SectionHeading eyebrow={tx(locale, 'ห้องสมุดหลักฐาน', 'Evidence library')} title={tx(locale, 'รายงานที่ตรวจทานแล้ว', 'Reviewed reports')} />
      <TxProvider dict={draftDict(locale)}><ReportLibrary reports={reports} locale={locale} /></TxProvider>
    </Container></Section>}

    <Section tone="paper"><Container>
      <div className="grid gap-8 lg:grid-cols-[1fr_minmax(0,28rem)] lg:items-end">
        <SectionHeading eyebrow={tx(locale, 'รายงานประจำปี', 'Annual report')} title={tx(locale, 'ผลการทำงานปี 2024', '2024 results')} lede={tx(locale, 'ตัวเลขด้านล่างมาจากรายงานประจำปี 2024 ของ LPN ซึ่งเผยแพร่ในเดือนพฤษภาคม 2025', 'These figures come from LPN’s 2024 annual report, published in May 2025.')} />
        {mediaMap.assistanceCentre && <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-black/5">
          <MediaImage media={mediaMap.assistanceCentre} fill sizes="(min-width: 1024px) 28rem, 100vw" className="object-cover" alt={tx(locale, 'ศูนย์ช่วยเหลือแรงงานของ LPN', 'LPN worker assistance centre')} />
        </div>}
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{metrics.map((m) => <article key={m.label} className="border-t-4 border-current bg-white p-6">
        <p className="text-4xl font-bold tracking-tight">{m.value} <span className="text-base font-bold">{m.unit}</span></p>
        <h3 className="mt-4 text-lg font-bold">{m.label}</h3>
        <p className="mt-3 text-sm leading-relaxed text-black/75">{m.definition}</p>
      </article>)}</div>
      <div className="mt-8 border-l-4 border-black bg-white p-6 text-sm leading-relaxed text-black/80">
        <p>{tx(locale, 'ขอบเขต: ตัวเลขปี 2024 ตามนิยามของรายงาน LPN กรณีช่วยเหลือและจำนวนผู้ได้รับประโยชน์เกี่ยวข้องกัน จึงไม่ควรนำมาบวกเป็นยอดรวมเดียว', 'Scope: 2024 figures as defined in LPN’s report. Assistance cases and people benefiting describe related activity and should not be added into one total.')}</p>
        <p className="mt-3">{tx(locale, 'ที่มาและวิธีการ: รายงานประจำปี LPN 2024 โปรดอ่านคำอธิบายของแต่ละโครงการในรายงานต้นฉบับ', 'Source and method: LPN Annual Report 2024. See the original report for each programme’s description.')}</p>
        <a href={REPORT_2024} className="link-mark mt-5 inline-block text-black">{tx(locale, 'เปิดรายงานประจำปี 2024 (PDF)', 'Open the 2024 annual report (PDF)')} →</a>
      </div>
    </Container></Section>

    <Section tone="light" id="fisher-health"><Container className="grid gap-10 lg:grid-cols-2 lg:items-center">
      <div>
      <SectionHeading eyebrow={tx(locale, 'งานวิจัยล่าสุด', 'Recent research')} title={tx(locale, 'แรงงานประมงกับการเข้าถึงสุขภาพ', 'Fishers’ access to healthcare')} lede={tx(locale, 'งานศึกษาที่ LPN เปิดตัวในปี 2026 รวบรวมเสียงของแรงงานประมงและครอบครัว 100 คนใน 8 จังหวัดชายฝั่ง เพื่อทำความเข้าใจการเข้าถึงบริการและสิทธิด้านสุขภาพ', 'An LPN study announced in 2026 gathered accounts from 100 fishers and family members in eight coastal provinces about access to healthcare and health rights.')} />
      <p className="mt-6 max-w-3xl text-sm leading-relaxed text-black/75">{tx(locale, 'นี่คือขอบเขตของการศึกษา ไม่ใช่จำนวนคนที่ได้รับการช่วยเหลือจาก LPN หรือหลักฐานว่าปัญหาเปลี่ยนแปลงแล้ว', 'This is the study sample, not a count of people assisted by LPN or evidence that conditions have already changed.')}</p>
      <a href={`/th/post/${encodeURIComponent(FISHER_HEALTH_SLUG)}`} className="link-mark mt-7 inline-block text-black">{tx(locale, 'อ่านข่าวเปิดตัวรายงาน', 'Read the report announcement (Thai)')} →</a>
      </div>
      {mediaMap.fisherHealthReport && <div className="relative aspect-[1092/596] overflow-hidden rounded-xl bg-black/5">
        <MediaImage media={mediaMap.fisherHealthReport} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" alt={tx(locale, 'การเปิดตัวรายงานแรงงานประมงกับการเข้าถึงสุขภาพ', 'Launch of the fishers’ healthcare report')} />
      </div>}
    </Container></Section>

    <Section tone="paper"><Container>
      <SectionHeading eyebrow={tx(locale, 'คลังสิ่งพิมพ์', 'Publications')} title={tx(locale, 'รายงานและบทความที่เกี่ยวข้อง', 'More reports and publications')} lede={tx(locale, 'รายงานการศึกษา รายงานประจำปี และข้อเสนอเชิงนโยบายของ LPN', 'LPN studies, annual reports and policy proposals.')} />
      {publications.length ? <div className="mt-9 grid gap-4 md:grid-cols-2">{publications.map((post) => <Link key={post.id} href={`/post/${post.slug}`} className="flex flex-col overflow-hidden rounded-xl border border-black/10 bg-white transition-colors hover:bg-brand-yellow/10">
        <div className="relative aspect-[16/9] bg-brand-yellow">
          {post.coverImage && typeof post.coverImage !== 'number'
            ? <MediaImage media={post.coverImage} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" alt="" />
            : <span className="absolute bottom-4 left-4 text-sm font-bold text-black/70">LPN</span>}
        </div>
        <div className="p-6">
        {post.publishedAt && <time dateTime={post.publishedAt} className="t-label text-black/70">{new Date(post.publishedAt).toLocaleDateString(dateLocale(locale), { year: 'numeric', month: 'short', day: 'numeric' })}</time>}
        <h3 className="t-h3 mt-3" lang={isDraftLocale(locale) ? (post.language ?? undefined) : undefined}>{post.title}</h3>
        {post.excerpt && <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-black/75" lang={isDraftLocale(locale) ? (post.language ?? undefined) : undefined}>{post.excerpt}</p>}
        <span className="link-mark mt-5 inline-block">{tx(locale, 'อ่านบทความ', 'Read publication')} →</span>
        </div>
      </Link>)}</div> : <p className="mt-8 text-sm text-black/75">{tx(locale, 'ยังไม่มีบทความในหมวดสิ่งพิมพ์สำหรับภาษานี้', 'No publication posts are available in this language yet.')}</p>}
    </Container></Section>

    <Section tone="dark"><Container className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
      <SectionHeading eyebrow={tx(locale, 'สนับสนุนงานที่ตรวจสอบได้', 'Support evidence-backed work')} title={tx(locale, 'ช่วยให้การทำงานนี้ดำเนินต่อไป', 'Help this work continue.')} tone="light" />
      <ButtonLink href="/donate" variant="primary">{tx(locale, 'ร่วมสนับสนุน LPN', 'Support LPN')}</ButtonLink>
    </Container></Section>
  </>
}
