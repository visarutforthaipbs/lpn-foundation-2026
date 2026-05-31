import { setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { routing } from '@/i18n/routing'
import { getPage } from '@/lib/api'
import { buildMetadata } from '@/lib/seo'

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

const BANK = {
  accountName: 'Labour Rights Promotion Network',
  bankEn: 'Krungthai Bank PCL, Chamchuri Square branch',
  bankTh: 'ธนาคารกรุงไทย สาขาจามจุรีสแควร์',
  accountNumber: '162-0-09432-0',
  swift: 'KRTHTHBK',
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
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-white/10 bg-black text-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{ backgroundImage: 'url(/images/trawler-hero.jpg)' }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/70 to-black/30" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 md:py-32">
          <div className="max-w-3xl">
            <span className="inline-flex rounded glass-tag px-3 py-1 text-[10px] font-black uppercase tracking-[0.25em] text-brand-yellow">
              {isThai ? 'ร่วมบริจาค' : 'Donate'}
            </span>
            <h1 className="mt-6 text-4xl font-black leading-[1.05] tracking-tight text-balance md:text-6xl">
              {isThai
                ? 'การบริจาคของคุณคือเชื้อเพลิงของปฏิบัติการกู้ภัย'
                : 'Your gift is the fuel behind every rescue.'}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/85 md:text-lg">
              {isThai
                ? 'ทุกบาททุกสตางค์เข้าสู่งานช่วยเหลือ การคุ้มครองทางกฎหมาย และเครือข่ายแรงงานที่นำไปสู่การเปลี่ยนแปลงระยะยาว'
                : 'Every dollar funds rescue operations, legal protection, and worker networks that drive lasting change.'}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#bank-details"
                className="rounded bg-brand-yellow px-7 py-3 text-xs font-black uppercase tracking-widest text-black transition-all hover:bg-white hover:text-black border border-transparent hover:border-black"
              >
                {isThai ? 'ดูข้อมูลโอนเงิน' : 'Bank transfer details'}
              </a>
              <Link
                href="/contact"
                className="rounded border border-white/45 bg-black/40 px-7 py-3 text-xs font-black uppercase tracking-widest text-white transition-all hover:bg-white hover:text-black"
              >
                {isThai ? 'พูดคุยกับเรา' : 'Talk to us'}
              </Link>
            </div>
          </div>

          <dl className="mt-12 grid max-w-2xl grid-cols-3 gap-4 border-l-4 border-brand-yellow pl-6">
            {heroStats.map((s) => (
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

      {/* IMPACT TIERS */}
      <section className="border-b border-black bg-white py-20 text-black md:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-12 max-w-2xl">
            <h2 className="text-3xl font-black uppercase tracking-tight md:text-5xl">
              {isThai ? 'ผลกระทบที่จับต้องได้' : 'Tangible impact'}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-black/70">
              {isThai
                ? 'ตัวอย่างจริงของสิ่งที่เกิดขึ้นเมื่อการบริจาคของคุณลงสนาม'
                : 'A snapshot of what your gift actually does in the field.'}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {tiers.map((t) => (
              <article
                key={t.tag}
                className="group relative overflow-hidden rounded border border-black bg-white p-7 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="absolute top-0 left-0 h-full w-1.5 bg-brand-yellow" />
                <div className="pl-3">
                  <div className="text-3xl font-black tracking-tight">{t.tag}</div>
                  <h3 className="mt-4 text-base font-black uppercase tracking-tight">{t.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-black/75">{t.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* BANK DETAILS */}
      <section
        id="bank-details"
        className="border-b border-white/10 bg-black py-20 text-white scroll-mt-20 md:py-24"
      >
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-10 md:grid-cols-[2fr_3fr] md:items-start">
            <div>
              <span className="inline-flex rounded glass-tag px-3 py-1 text-[10px] font-black uppercase tracking-[0.25em] text-brand-yellow">
                {isThai ? 'โอนเงิน' : 'Bank transfer'}
              </span>
              <h2 className="mt-6 text-3xl font-black uppercase tracking-tight md:text-4xl">
                {isThai ? 'โอนเข้าบัญชีของเราโดยตรง' : 'Send a gift directly.'}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-white/70">
                {isThai
                  ? 'ใช้รายละเอียดด้านขวานี้สำหรับการโอนทั้งในและต่างประเทศ หากต้องการใบเสร็จกรุณาแจ้งเราที่อีเมล'
                  : 'Use the details on the right for domestic or international transfers. Email us for a receipt.'}
              </p>
            </div>

            <div className="relative overflow-hidden glass-dark rounded p-8">
              <span className="absolute top-0 left-0 h-1.5 w-12 bg-brand-yellow" />
              <dl className="grid gap-5">
                {[
                  { k: isThai ? 'ชื่อบัญชี' : 'Account name', v: BANK.accountName },
                  { k: isThai ? 'ธนาคาร' : 'Bank', v: isThai ? BANK.bankTh : BANK.bankEn },
                  { k: isThai ? 'เลขที่บัญชี' : 'Account number', v: BANK.accountNumber },
                  { k: 'SWIFT', v: BANK.swift },
                ].map((row) => (
                  <div
                    key={row.k}
                    className="grid gap-1 border-b border-white/10 pb-4 last:border-b-0 last:pb-0"
                  >
                    <dt className="text-[10px] font-bold uppercase tracking-widest text-white/55">
                      {row.k}
                    </dt>
                    <dd className="font-mono text-base text-white md:text-lg">{row.v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* OTHER WAYS TO GIVE */}
      <section className="border-b border-black bg-white py-20 text-black md:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-12 max-w-2xl">
            <h2 className="text-3xl font-black uppercase tracking-tight md:text-4xl">
              {isThai ? 'วิธีอื่นในการสนับสนุน' : 'Other ways to give'}
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {ways.map((w, i) => (
              <article
                key={w.title}
                className="group relative overflow-hidden rounded border border-black bg-white p-7 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="absolute top-0 left-0 h-full w-1.5 bg-brand-yellow" />
                <div className="pl-3">
                  <span className="text-xs font-black uppercase tracking-[0.25em] text-black/40">
                    0{i + 1}
                  </span>
                  <h3 className="mt-3 text-lg font-black uppercase tracking-tight">{w.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-black/75">{w.body}</p>
                </div>
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
              {isThai ? 'อยากออกแบบการสนับสนุนเฉพาะตัว?' : 'Want a tailored way to give?'}
            </h2>
            <p className="mt-3 text-sm text-black/80 md:text-base">
              {isThai
                ? 'ทีมงานของเรายินดีพูดคุยเรื่องการสนับสนุนโครงการ การให้ทุน หรือการระดมทุนของชุมชน'
                : 'Our team is happy to talk through programme giving, grants, or community fundraising.'}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="rounded bg-black px-6 py-3 text-xs font-black uppercase tracking-widest text-brand-yellow transition-all hover:bg-white hover:text-black border border-black"
            >
              {isThai ? 'ติดต่อทีมระดมทุน' : 'Talk to our team'}
            </Link>
            <Link
              href="/projects"
              className="rounded border border-black bg-transparent px-6 py-3 text-xs font-black uppercase tracking-widest text-black transition-all hover:bg-black hover:text-brand-yellow"
            >
              {isThai ? 'ดูโครงการ' : 'See projects'}
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
