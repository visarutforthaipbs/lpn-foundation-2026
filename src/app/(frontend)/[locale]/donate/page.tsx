import { WixIntegratedCopy } from '@/components/WixIntegratedCopy'
import { setRequestLocale } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'
import { routing } from '@/i18n/routing'
import { getPage } from '@/lib/api'
import { buildMetadata } from '@/lib/seo'
import { BANK } from '@/lib/content'
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
  const page = await getPage('donate', locale)
  return buildMetadata({
    locale,
    path: '/donate',
    title: page?.meta?.title || 'Donate to LPN',
    description:
      page?.meta?.description ||
      'Fund rescue operations, survivor assistance, and prevention programmes at LPN Foundation.',
  })
}

export default async function DonatePage(props: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await props.params
  setRequestLocale(locale)
  const isThai = locale === 'th'

  const heroStats = isThai
    ? [
        { value: '100%', label: 'ของยอดบริจาคเข้าสู่ภารกิจ' },
        { value: '24/7', label: 'ทีมตอบสนองภาคสนาม' },
        { value: '15+', label: 'ปีของผลลัพธ์จริง' },
      ]
    : [
        { value: '100%', label: 'goes to the mission' },
        { value: '24/7', label: 'field response' },
        { value: '15+', label: 'years of real outcomes' },
      ]

  const tiers = isThai
    ? [
        {
          tag: '฿500',
          title: 'ชุดช่วยเหลือ',
          body: 'ค่าเดินทางและอุปกรณ์เบื้องต้นในการเข้าถึงผู้เสียหายในพื้นที่ห่างไกล',
        },
        {
          tag: '฿2,500',
          title: 'หนึ่งเดือนในบ้านพักปลอดภัย',
          body: 'อาหาร ที่พัก และการเยียวยาจิตใจหนึ่งเดือนสำหรับผู้รอด',
        },
        {
          tag: '฿10,000',
          title: 'หนึ่งปฏิบัติการกู้ภัย',
          body: 'ร่วมสมทบทุนปฏิบัติการกู้ภัยข้ามจังหวัดหรือข้ามพรมแดน',
        },
        {
          tag: '฿25,000',
          title: 'หนึ่งภาคเรียนของลูกแรงงาน',
          body: 'ค่าเล่าเรียน อุปกรณ์ และทุนสนับสนุนเด็กข้ามชาติหนึ่งคนต่อเทอม',
        },
      ]
    : [
        {
          tag: '$15',
          title: 'A response kit',
          body: 'Field transport and supplies to reach a worker in a remote site.',
        },
        {
          tag: '$75',
          title: 'One month of safe shelter',
          body: 'Food, lodging, and psychosocial care for a survivor for a month.',
        },
        {
          tag: '$300',
          title: 'One rescue operation',
          body: 'Co-funds a cross-province or cross-border rescue operation.',
        },
        {
          tag: '$750',
          title: 'One semester of school',
          body: 'Tuition, supplies, and bursary support for a migrant child for one term.',
        },
      ]

  const ways = isThai
    ? [
        {
          title: 'โอนเงินผ่านธนาคาร',
          body: 'รายละเอียดบัญชีอยู่ด้านล่าง — ใช้ได้ทั้งในและต่างประเทศ',
        },
        {
          title: 'สนับสนุนโครงการเฉพาะ',
          body: 'ติดต่อเราเพื่อพูดคุยเรื่องการสนับสนุนโครงการกู้ภัย กฎหมาย หรือการศึกษา',
        },
        {
          title: 'ระดมทุนกับชุมชนของคุณ',
          body: 'จัดกิจกรรมระดมทุนในนามของคุณหรือองค์กร — เราจะช่วยเล่าผลกระทบให้ผู้สนับสนุน',
        },
      ]
    : [
        {
          title: 'Bank transfer',
          body: 'See bank details below — works for domestic and international transfers.',
        },
        {
          title: 'Fund a specific programme',
          body: 'Talk to us about supporting a rescue, legal, or education programme by name.',
        },
        {
          title: 'Run a community fundraiser',
          body: 'Host an event or campaign in your name. We’ll help you tell donors the impact.',
        },
      ]

  return (
    <>
      {/* ---------------------------------------------------------------- HERO */}
      <PageHero
        compact
        eyebrow={isThai ? 'ร่วมบริจาค' : 'Donate'}
        title={isThai ? 'การบริจาคของคุณคือเชื้อเพลิงของปฏิบัติการกู้ภัย' : 'Your gift is the fuel behind every rescue.'}
        lede={
          isThai
            ? 'ทุกบาททุกสตางค์เข้าสู่งานช่วยเหลือ การคุ้มครองทางกฎหมาย และเครือข่ายแรงงานที่นำไปสู่การเปลี่ยนแปลงระยะยาว'
            : 'Every dollar funds rescue operations, legal protection, and worker networks that drive lasting change.'
        }
        stats={heroStats}
        actions={
          <>
            <ButtonLink href="#bank-details" variant="primary">
              {isThai ? 'ดูข้อมูลโอนเงิน' : 'Bank transfer details'}
            </ButtonLink>
            <ButtonLink href="/contact" variant="ghostLight">
              {isThai ? 'พูดคุยกับเรา' : 'Talk to us'}
            </ButtonLink>
          </>
        }
      />

      {/* --------------------------------------------------------- IMPACT TIERS */}
      <Section tone="light" className="on-light">
        <Container>
          <SectionHeading
            title={isThai ? 'ผลกระทบที่จับต้องได้' : 'Tangible impact'}
            lede={
              isThai
                ? 'ตัวอย่างจริงของสิ่งที่เกิดขึ้นเมื่อการบริจาคของคุณลงสนาม'
                : 'A snapshot of what your gift actually does in the field.'
            }
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {tiers.map((t) => (
              <article key={t.tag} className="card card-marked p-7">
                <span className="tactile-badge px-4 py-1.5 text-sm font-black text-black">
                  {t.tag}
                </span>
                <h3 className="t-h3 mt-5">{t.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-black/70">{t.body}</p>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      {/* -------------------------------------------------------- BANK DETAILS */}
      <Section tone="dark" id="bank-details" className="border-y border-white/10 scroll-mt-24">
        <Container>
          <div className="grid gap-10 md:grid-cols-[2fr_3fr] md:items-start">
            <div>
              <span className="eyebrow text-brand-yellow">{isThai ? 'โอนเงิน' : 'Bank transfer'}</span>
              <h2 className="t-h2 mt-5 text-white">
                {isThai ? 'โอนเข้าบัญชีของเราโดยตรง' : 'Send a gift directly.'}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-white/70">
                {isThai
                  ? 'ใช้รายละเอียดด้านขวานี้สำหรับการโอนทั้งในและต่างประเทศ หากต้องการใบเสร็จกรุณาแจ้งเราที่อีเมล'
                  : 'Use the details on the right for domestic or international transfers. Email us for a receipt.'}
              </p>
            </div>
            <div className="glass-dark relative rounded-lg p-8">
              <span className="absolute top-0 left-0 h-1.5 w-12 bg-brand-yellow" aria-hidden="true" />
              <dl className="grid gap-5">
                {[
                  { k: isThai ? 'ชื่อบัญชี' : 'Account name', v: BANK.accountName },
                  { k: isThai ? 'ธนาคาร' : 'Bank', v: isThai ? BANK.bankTh : BANK.bankEn },
                  { k: isThai ? 'เลขที่บัญชี' : 'Account number', v: BANK.accountNumber },
                  { k: 'SWIFT', v: BANK.swift },
                ].map((row) => (
                  <div
                    key={row.k}
                    className="grid gap-1.5 border-b border-white/10 pb-4 last:border-b-0 last:pb-0"
                  >
                    <dt className="t-label text-white/55">{row.k}</dt>
                    <dd className="tactile-well-dark px-3 py-2 font-mono text-base font-bold text-white md:text-lg">
                      {row.v}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </Container>
      </Section>

      {/* ------------------------------------------------------ OTHER WAYS TO GIVE */}
      <Section tone="light" className="on-light">
        <Container>
          <SectionHeading title={isThai ? 'วิธีอื่นในการสนับสนุน' : 'Other ways to give'} />
          <div className="mt-10">
            {ways.map((w, i) => (
              <EditorialRow key={w.title} index={`0${i + 1}`} title={w.title} body={w.body} />
            ))}
          </div>
        </Container>
      </Section>

      {/* ---------------------------------------------------------------- CTA */}
      <CtaBand
        heading={isThai ? 'อยากออกแบบการสนับสนุนเฉพาะตัว?' : 'Want a tailored way to give?'}
        body={
          isThai
            ? 'ทีมงานของเรายินดีพูดคุยเรื่องการสนับสนุนโครงการ การให้ทุน หรือการระดมทุนของชุมชน'
            : 'Our team is happy to talk through programme giving, grants, or community fundraising.'
        }
        actions={
          <>
            <ButtonLink href="/contact" variant="solidDark">
              {isThai ? 'ติดต่อทีมระดมทุน' : 'Talk to our team'}
            </ButtonLink>
            <ButtonLink href="/projects" variant="ghostDark">
              {isThai ? 'ดูโครงการ' : 'See projects'}
            </ButtonLink>
          </>
        }
      />
      <WixIntegratedCopy slug="donate" locale={locale} />
    </>
  )
}
