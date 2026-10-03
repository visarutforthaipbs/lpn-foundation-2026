import { setRequestLocale } from 'next-intl/server'
import Image from 'next/image'
import { Banknote, BookOpen, FileText, HeartPulse, PhoneCall, ShieldAlert, UsersRound } from 'lucide-react'
import type { Locale } from '@/i18n/routing'
import { buildMetadata } from '@/lib/seo'
import { telHref } from '@/lib/content'
import { getHelpChannels } from '@/lib/help-channels'
import { ButtonLink, Container, Section, SectionHeading } from '@/components/ui'

const GUIDE = 'https://www.lpnrightguide.site/'

export async function generateMetadata(props: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await props.params
  return buildMetadata({
    locale,
    path: '/get-help',
    title: locale === 'th' ? 'ขอความช่วยเหลือ — LPN' : 'Get Help — LPN',
    description: locale === 'th'
      ? 'ติดต่อ LPN โดยตรง หรือเรียนรู้สิทธิของคุณในคู่มือรู้สิทธิ ติดกระเป๋า'
      : 'Contact LPN directly or learn about your rights with the LPN Rights Guide.',
  })
}

export default async function GetHelpPage(props: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await props.params
  setRequestLocale(locale)
  const th = locale === 'th'
  const hotlines = await getHelpChannels(locale)
  const issues = [
    { title: th ? 'ค่าจ้างและงาน' : 'Pay and work', icon: Banknote },
    { title: th ? 'เอกสารและการเดินทาง' : 'Documents and migration', icon: FileText },
    { title: th ? 'ความปลอดภัย' : 'Safety and exploitation', icon: ShieldAlert },
    { title: th ? 'สุขภาพ' : 'Health and care', icon: HeartPulse },
    { title: th ? 'เด็กและครอบครัว' : 'Children and family', icon: UsersRound },
  ]
  const nativeLanguages: Record<string, { label: string; lang: string }> = {
    TH: { label: 'ภาษาไทย', lang: 'th' },
    MM: { label: 'မြန်မာ', lang: 'my' },
    KH: { label: 'ភាសាខ្មែរ', lang: 'km' },
    LA: { label: 'ພາສາລາວ', lang: 'lo' },
  }

  return <>
    <section className="relative overflow-hidden bg-black text-white">
      {/* Authentic field photography backdrop */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/field-action.jpg"
          alt={th ? 'การลงพื้นที่ช่วยเหลือแรงงานของ LPN' : 'LPN frontline field assistance'}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-55 brightness-90 contrast-105"
        />
        <div className="absolute inset-0 bg-linear-to-r from-black via-black/80 to-black/45 pointer-events-none" />
        <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-black/40 pointer-events-none" />
      </div>

      <Container className="relative z-10 py-12 md:py-20">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-yellow/15 border border-brand-yellow/30 text-brand-yellow">
            <ShieldAlert className="h-4.5 w-4.5" aria-hidden="true" />
          </div>
          <p className="eyebrow text-brand-yellow">{th ? 'ขอความช่วยเหลือ' : 'Get help'}</p>
        </div>
        <h1 className="t-display mt-5 max-w-4xl text-white">{th ? 'ต้องการความช่วยเหลือ?' : 'Need help?'}</h1>
        <p className="t-lede mt-4 max-w-2xl text-white/90">{th
          ? 'เลือกติดต่อ LPN หรือเปิดคู่มือรู้สิทธิ'
          : 'Choose how you want to start.'}</p>
        <div className="mt-8 grid max-w-3xl gap-3 sm:grid-cols-2">
          <a href="#contact" className="group flex min-h-40 flex-col justify-between border-2 border-brand-yellow bg-brand-yellow p-5 text-black transition-colors hover:bg-white focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-brand-yellow">
            <PhoneCall size={38} strokeWidth={1.8} aria-hidden="true" />
            <span className="mt-5 flex items-end justify-between gap-3 text-xl font-black leading-tight sm:text-2xl">{th ? 'โทรหา LPN' : 'Call LPN'} <span aria-hidden="true">↗</span></span>
            <span className="mt-1 text-sm font-semibold">{th ? 'เลือกภาษาของคุณ' : 'Choose your language'}</span>
          </a>
          <a href={GUIDE} className="group flex min-h-40 flex-col justify-between border-2 border-white bg-black/75 p-5 text-white transition-colors hover:bg-white hover:text-black focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-brand-yellow">
            <BookOpen size={38} strokeWidth={1.8} aria-hidden="true" />
            <span className="mt-5 flex items-end justify-between gap-3 text-xl font-black leading-tight sm:text-2xl">{th ? 'รู้สิทธิของฉัน' : 'Know my rights'} <span aria-hidden="true">↗</span></span>
            <span className="mt-1 text-sm font-semibold">{th ? 'เปิดคู่มือรู้สิทธิ' : 'Open the Rights Guide'}</span>
          </a>
        </div>
      </Container>
    </section>

    <Section tone="yellow" id="contact"><Container>
      <SectionHeading eyebrow={th ? 'ติดต่อโดยตรง' : 'Direct contact'} title={th ? 'เลือกภาษาที่ต้องการ' : 'Choose your language'} />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{hotlines.map((h) => <a
        key={h.code} href={telHref(h.phone)}
        className="flex min-h-36 flex-col justify-between border-2 border-black bg-white p-5 transition-colors hover:bg-black hover:text-white focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-black"
        aria-label={`${th ? h.langTh : h.langEn}: ${h.phone}`}
      >
        <span className="flex items-start justify-between gap-2 font-bold">
          <span>{h.code === 'TH' ? (th ? h.langTh : h.langEn) : <>
            <span className="block text-lg" lang={nativeLanguages[h.code]?.lang}>{nativeLanguages[h.code]?.label}</span>
            <span className="mt-1 block text-sm font-semibold">{th ? h.langTh : h.langEn}</span>
          </>}</span>
          <PhoneCall size={23} strokeWidth={2} aria-hidden="true" />
        </span>
        <span className="mt-6 font-mono text-xl font-black break-all">{h.phone}</span>
      </a>)}</div>
      <p className="mt-6 max-w-3xl text-sm leading-relaxed text-black/80">{th
        ? 'โทรไม่ติด? ดูช่องทางอื่นในหน้าติดต่อ'
        : 'Call not connecting? See other ways to contact LPN.'}{' '}
        <a className="font-bold underline underline-offset-4" href={`/${locale}/contact`}>{th ? 'ดูหน้าติดต่อ' : 'View contact page'}</a>
      </p>
    </Container></Section>

    <Section tone="light"><Container>
      <SectionHeading eyebrow={th ? 'เรื่องที่ช่วยได้' : 'What we can discuss'} title={th ? 'เริ่มจากเรื่องของคุณ' : 'Start with your situation'} />
      <ul className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">{issues.map(({ title, icon: Icon }) => <li key={title} className="flex min-h-36 flex-col justify-between border-t-4 border-brand-yellow bg-paper p-4 sm:p-5">
        <Icon size={36} strokeWidth={1.7} aria-hidden="true" />
        <span className="mt-5 text-base font-bold leading-snug">{title}</span>
      </li>)}</ul>
      <p className="mt-6 text-sm text-black/75">{th ? 'ไม่ต้องเลือกหมวดหมู่ก่อนโทร' : 'You do not need to choose a topic before calling.'}</p>
    </Container></Section>

    <Section tone="paper"><Container className="grid gap-9 lg:grid-cols-[auto_1fr_auto] lg:items-center">
      <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border border-black/10 bg-white p-3 shadow-xs">
        <Image
          src="/logos/right-guide/favicon-rightguild-new.svg"
          alt={th ? 'โลโก้ รู้สิทธิ ติดกระเป๋า' : 'LPN Rights Guide Logo'}
          width={80}
          height={80}
          unoptimized
          className="h-20 w-20 object-contain"
        />
      </div>
      <div>
        <SectionHeading eyebrow={th ? 'เรียนรู้ด้วยตัวเอง' : 'Learn at your own pace'} title={th ? 'รู้สิทธิ ติดกระเป๋า' : 'LPN Rights Guide'} lede={th
          ? 'คู่มือเรื่องงาน เอกสาร สุขภาพ และครอบครัว มีภาษาไทย อังกฤษ และพม่า ติดต่อ LPN ได้ทันทีโดยไม่ต้องอ่านคู่มือก่อน'
          : 'Practical guidance on work, documents, health, and family in Thai, English, and Burmese. You can contact LPN without reading it first.'} />
      </div>
      <ButtonLink href={GUIDE} variant="solidDark">{th ? 'เปิดคู่มือรู้สิทธิ' : 'Open the Rights Guide'}</ButtonLink>
    </Container></Section>
  </>
}
