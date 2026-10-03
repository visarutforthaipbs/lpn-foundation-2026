import { setRequestLocale } from 'next-intl/server'
import Image from 'next/image'
import { Globe } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { getImpactMetrics, getPosts, getReports } from '@/lib/api'
import { buildMetadata } from '@/lib/seo'
import { ButtonLink, Container, Section, SectionHeading } from '@/components/ui'
import { ReportLibrary } from '@/components/ReportLibrary'

const REPORT_2024 = 'https://d90624d9-477d-4d0e-8335-c4795fa13a13.usrfiles.com/ugd/d90624_78b68c9d8aff4a41856fc475cd1d5c37.pdf'
const FISHER_HEALTH_SLUG = 'เปิดตัวรายงาน-การยกระดับคุณภาพชีวิตแรงงานประมงในด้านการเข้าถึงบริการสาธารณสุขและสิทธิทางสุขภาพ'

export async function generateMetadata(props: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await props.params
  return buildMetadata({
    locale,
    path: '/impact',
    title: locale === 'th' ? 'ผลการทำงานและรายงาน — LPN' : 'Impact & Reports — LPN',
    description: locale === 'th'
      ? 'ดูผลการทำงานที่มีช่วงเวลาและแหล่งอ้างอิง รวมถึงรายงานและงานวิจัยของ LPN'
      : 'Explore dated results, methods, annual reports, and field research from LPN.',
  })
}

export default async function ImpactPage(props: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await props.params
  setRequestLocale(locale)
  const th = locale === 'th'
  const [{ docs: publications }, reviewedMetrics, reports] = await Promise.all([
    getPosts(locale, { categorySlug: 'publications', limit: 12 }),
    getImpactMetrics(locale),
    getReports(locale),
  ])
  const metrics = th ? [
    { value: '135', unit: 'กรณี', label: 'กรณีช่วยเหลือแรงงาน', definition: 'จำนวนกรณีช่วยเหลือแรงงานที่ LPN รายงานในปี 2024' },
    { value: '707', unit: 'คน', label: 'ผู้ได้รับประโยชน์', definition: 'จำนวนคนที่ได้รับประโยชน์จากกรณีช่วยเหลือแรงงาน 135 กรณี' },
    { value: '832', unit: 'คน', label: 'แรงงานได้รับการอบรม', definition: 'จำนวนแรงงานที่ LPN รายงานว่าเข้าร่วมการอบรม' },
    { value: '80', unit: 'คน', label: 'เยาวชนในโครงการ', definition: 'จำนวนเยาวชนในโครงการด้านการศึกษาและการสนับสนุน' },
  ] : [
    { value: '135', unit: 'cases', label: 'worker-assistance cases', definition: 'Worker-assistance cases reported by LPN for 2024.' },
    { value: '707', unit: 'people', label: 'people benefiting', definition: 'People benefiting from those 135 worker-assistance cases.' },
    { value: '832', unit: 'workers', label: 'workers trained', definition: 'Workers reported by LPN as having received training.' },
    { value: '80', unit: 'youth', label: 'young people supported', definition: 'Young people in an education and support project.' },
  ]

  return <>
    <section className="relative overflow-hidden bg-black text-white">
      {/* Authentic field photography backdrop */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/learning-center.jpg"
          alt={th ? 'การดำเนินงานและศูนย์การเรียนรู้ LPN' : 'LPN learning center and evidence operations'}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-30 brightness-90 contrast-105"
        />
        <div className="absolute inset-0 bg-linear-to-r from-black via-black/85 to-black/60 pointer-events-none" />
        <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-black/40 pointer-events-none" />
      </div>

      <Container className="relative z-10 py-16 md:py-24">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-yellow/15 border border-brand-yellow/30 text-brand-yellow">
            <Globe className="h-4.5 w-4.5" aria-hidden="true" />
          </div>
          <p className="eyebrow text-brand-yellow">{th ? 'ผลการทำงานและรายงาน' : 'Impact & Reports'}</p>
        </div>
        <h1 className="t-display mt-6 max-w-5xl text-white">{th ? 'ดูหลักฐาน พร้อมช่วงเวลาและที่มา' : 'Evidence with dates and sources.'}</h1>
        <p className="t-lede mt-7 max-w-3xl text-white/80">{th
          ? 'ตัวเลขผลการทำงานบอกว่า LPN ทำอะไรและเข้าถึงใคร งานวิจัยช่วยอธิบายปัญหาในระบบ ทั้งสองอย่างสำคัญ แต่ไม่ใช่สิ่งเดียวกัน'
          : 'Results show what LPN did and whom it reached. Research describes wider conditions. Both matter, but they measure different things.'}</p>
      </Container>
    </section>

    {reviewedMetrics.length > 0 && <Section tone="paper"><Container>
      <SectionHeading eyebrow={th ? 'ข้อมูลที่บรรณาธิการตรวจทาน' : 'Reviewed metrics'} title={th ? 'ตัวเลขพร้อมนิยามและแหล่งที่มา' : 'Figures with definitions and sources'} />
      <div className="mt-10 grid gap-5 md:grid-cols-2">{reviewedMetrics.map((metric) => {
        const source = typeof metric.sourceReport === 'object' && metric.sourceReport ? metric.sourceReport.sourceURL : metric.sourceURL
        return <article key={metric.id} className="border-t-4 border-brand-yellow bg-white p-6">
          <p className="text-3xl font-black">{metric.value} <span className="text-base">{metric.unit}</span></p>
          <h3 className="t-h3 mt-4">{metric.label}</h3>
          <p className="mt-2 text-sm font-semibold">{metric.periodLabel}</p>
          <p className="mt-4 text-sm leading-relaxed text-black/75">{metric.definition}</p>
          {metric.method && <p className="mt-3 text-sm leading-relaxed text-black/70">{metric.method}</p>}
          {source && <a href={source} className="link-mark mt-5 inline-block text-black">{th ? 'ดูแหล่งที่มา' : 'View source'} →</a>}
        </article>
      })}</div>
    </Container></Section>}

    {reports.length > 0 && <Section tone="light"><Container>
      <SectionHeading eyebrow={th ? 'ห้องสมุดหลักฐาน' : 'Evidence library'} title={th ? 'รายงานที่ตรวจทานแล้ว' : 'Reviewed reports'} />
      <ReportLibrary reports={reports} locale={locale} />
    </Container></Section>}

    <Section tone="paper"><Container>
      <SectionHeading eyebrow={th ? 'รายงานประจำปี' : 'Annual report'} title={th ? 'ผลการทำงานปี 2024' : '2024 results'} lede={th ? 'ตัวเลขด้านล่างมาจากรายงานประจำปี 2024 ของ LPN ซึ่งเผยแพร่ในเดือนพฤษภาคม 2025' : 'These figures come from LPN’s 2024 annual report, published in May 2025.'} />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{metrics.map((m) => <article key={m.label} className="border-t-4 border-brand-yellow bg-white p-6">
        <p className="text-4xl font-black tracking-tight">{m.value} <span className="text-base font-bold">{m.unit}</span></p>
        <h3 className="mt-4 text-lg font-bold">{m.label}</h3>
        <p className="mt-3 text-sm leading-relaxed text-black/75">{m.definition}</p>
      </article>)}</div>
      <div className="mt-8 border-l-4 border-black bg-white p-6 text-sm leading-relaxed text-black/80">
        <p>{th
          ? 'ขอบเขต: ตัวเลขปี 2024 ตามนิยามของรายงาน LPN กรณีช่วยเหลือและจำนวนผู้ได้รับประโยชน์เกี่ยวข้องกัน จึงไม่ควรนำมาบวกเป็นยอดรวมเดียว'
          : 'Scope: 2024 figures as defined in LPN’s report. Assistance cases and people benefiting describe related activity and should not be added into one total.'}</p>
        <p className="mt-3">{th ? 'ที่มาและวิธีการ: รายงานประจำปี LPN 2024 โปรดอ่านคำอธิบายของแต่ละโครงการในรายงานต้นฉบับ' : 'Source and method: LPN Annual Report 2024. See the original report for each programme’s description.'}</p>
        <a href={REPORT_2024} className="link-mark mt-5 inline-block text-black">{th ? 'เปิดรายงานประจำปี 2024 (PDF)' : 'Open the 2024 annual report (PDF)'} →</a>
      </div>
    </Container></Section>

    <Section tone="light" id="fisher-health"><Container>
      <SectionHeading eyebrow={th ? 'งานวิจัยล่าสุด' : 'Recent research'} title={th ? 'แรงงานประมงกับการเข้าถึงสุขภาพ' : 'Fishers’ access to healthcare'} lede={th
        ? 'งานศึกษาที่ LPN เปิดตัวในปี 2026 รวบรวมเสียงของแรงงานประมงและครอบครัว 100 คนใน 8 จังหวัดชายฝั่ง เพื่อทำความเข้าใจการเข้าถึงบริการและสิทธิด้านสุขภาพ'
        : 'An LPN study announced in 2026 gathered accounts from 100 fishers and family members in eight coastal provinces about access to healthcare and health rights.'} />
      <p className="mt-6 max-w-3xl text-sm leading-relaxed text-black/75">{th
        ? 'นี่คือขอบเขตของการศึกษา ไม่ใช่จำนวนคนที่ได้รับการช่วยเหลือจาก LPN หรือหลักฐานว่าปัญหาเปลี่ยนแปลงแล้ว'
        : 'This is the study sample, not a count of people assisted by LPN or evidence that conditions have already changed.'}</p>
      <a href={`/th/post/${encodeURIComponent(FISHER_HEALTH_SLUG)}`} className="link-mark mt-7 inline-block text-black">{th ? 'อ่านข่าวเปิดตัวรายงาน' : 'Read the report announcement (Thai)'} →</a>
    </Container></Section>

    <Section tone="paper"><Container>
      <SectionHeading eyebrow={th ? 'คลังสิ่งพิมพ์' : 'Publications'} title={th ? 'รายงานและบทความที่เกี่ยวข้อง' : 'More reports and publications'} lede={th ? 'คัดจากหมวดสิ่งพิมพ์ในบทความที่ย้ายจาก Wix มายัง Payload' : 'Selected from the Publications category migrated from Wix into Payload.'} />
      {publications.length ? <div className="mt-9 grid gap-4 md:grid-cols-2">{publications.map((post) => <Link key={post.id} href={`/post/${post.slug}`} className="border-l-4 border-brand-yellow bg-white p-6 transition-colors hover:bg-brand-yellow/10">
        {post.publishedAt && <time dateTime={post.publishedAt} className="t-label text-black/70">{new Date(post.publishedAt).toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' })}</time>}
        <h3 className="t-h3 mt-3">{post.title}</h3>
        {post.excerpt && <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-black/75">{post.excerpt}</p>}
        <span className="link-mark mt-5 inline-block">{th ? 'อ่านบทความ' : 'Read publication'} →</span>
      </Link>)}</div> : <p className="mt-8 text-sm text-black/75">{th ? 'ยังไม่มีบทความในหมวดสิ่งพิมพ์สำหรับภาษานี้' : 'No publication posts are available in this language yet.'}</p>}
    </Container></Section>

    <Section tone="dark"><Container className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
      <SectionHeading eyebrow={th ? 'สนับสนุนงานที่ตรวจสอบได้' : 'Support evidence-backed work'} title={th ? 'ช่วยให้การทำงานนี้ดำเนินต่อไป' : 'Help this work continue.'} tone="light" />
      <ButtonLink href="/donate" variant="primary">{th ? 'ร่วมสนับสนุน LPN' : 'Support LPN'}</ButtonLink>
    </Container></Section>
  </>
}
