import Image from 'next/image'
import { setRequestLocale } from 'next-intl/server'
import { ArrowDown, BookOpen, LifeBuoy, Scale } from 'lucide-react'
import type { Locale } from '@/i18n/routing'
import { DonationChannelPreview } from '@/components/DonationChannelPreview'
import { ButtonLink, Container, Section } from '@/components/ui'
import { getPage } from '@/lib/api'
import { buildMetadata } from '@/lib/seo'

export async function generateMetadata(props: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await props.params
  const page = await getPage('donate', locale)
  return buildMetadata({
    locale,
    path: '/donate',
    title: page?.meta?.title || (locale === 'th' ? 'สนับสนุน LPN' : 'Support LPN'),
    description: locale === 'th'
      ? 'สนับสนุนงานช่วยเหลือแรงงาน การสร้างความรู้ และการเปลี่ยนแปลงระบบของ LPN'
      : 'Support LPN’s worker assistance, community learning, and systems change.',
  })
}

export default async function DonatePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const th = locale === 'th'
  const streams = th ? [
    [LifeBuoy, 'ช่วยเหลือและคุ้มครอง', '/images/fisher-protection.jpg'],
    [BookOpen, 'เรียนรู้กับชุมชน', '/images/field-action.jpg'],
    [Scale, 'เปลี่ยนแปลงระบบ', null],
  ] as const : [
    [LifeBuoy, 'Respond and protect', '/images/fisher-protection.jpg'],
    [BookOpen, 'Learn with communities', '/images/field-action.jpg'],
    [Scale, 'Build fairer systems', null],
  ] as const

  return <>
    <div className="border-b border-black/15 bg-brand-yellow py-3 text-black"><Container><p className="text-sm font-semibold">{th ? 'แบบร่างสำหรับหารือกับปฏิมา · ยังไม่มีการชำระเงิน · ช่องทางและจำนวนเงินเป็นตัวอย่าง' : 'Design for discussion with Patima · Payments inactive · Methods and amounts are illustrative'}</p></Container></div>
    <section className="bg-black text-white"><Container className="grid lg:grid-cols-[1.1fr_1fr]">
      <div className="py-12 pr-0 sm:py-16 lg:pr-12">
        <p className="eyebrow text-brand-yellow">{th ? 'สนับสนุน LPN' : 'Support LPN'}</p>
        <h1 className="mt-5 max-w-2xl text-4xl leading-tight font-semibold sm:text-5xl xl:text-6xl">{th ? 'เคียงข้างแรงงานและครอบครัว' : 'Stand beside workers and families.'}</h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/75">{th ? 'ช่วยให้การคุ้มครอง ความรู้ และโอกาสเข้าถึงคนที่ต้องการ เลือกช่องทางที่เหมาะกับคุณ' : 'Help make protection, knowledge, and opportunity reachable. Choose the giving channel that works for you.'}</p>
        <div className="mt-7"><ButtonLink href="#giving-channels" variant="primary">{th ? 'เลือกช่องทางบริจาค' : 'Choose how to give'}<ArrowDown size={18} aria-hidden="true" /></ButtonLink></div>
      </div>
      <div className="relative min-h-60 lg:my-8"><Image src="/images/community-outreach.jpg" alt={th ? 'การทำงานกับชุมชนของ LPN' : 'LPN working with communities'} fill priority sizes="(max-width: 1023px) 100vw, 45vw" className="object-cover" /></div>
    </Container></section>

    <Section tone="paper"><Container><DonationChannelPreview locale={locale} /></Container></Section>

    <Section><Container>
      <div className="flex flex-wrap items-end justify-between gap-5"><h2 className="t-h2 max-w-2xl">{th ? 'การสนับสนุนหนึ่งครั้ง เชื่อมงานสามด้าน' : 'One mission. Three connected strands.'}</h2><ButtonLink href="/impact" variant="ghostDark">{th ? 'ดูผลการทำงานและรายงาน' : 'Explore impact and reports'}</ButtonLink></div>
      <div className="mt-8 grid gap-5 md:grid-cols-3">{streams.map(([Icon, title, image]) => <article key={title} className="bg-paper"><div className="relative aspect-3/2">{image ? <Image src={image} alt="" fill sizes="(max-width: 767px) 100vw, 33vw" className="object-cover" /> : <div className="flex h-full flex-col items-center justify-center gap-5 bg-black p-6 text-white"><Scale size={64} strokeWidth={1} className="text-brand-yellow" aria-hidden="true" /><p className="text-center text-sm font-semibold">{th ? 'หลักฐาน → เสียงของแรงงาน → การเปลี่ยนแปลง' : 'Evidence → Worker voice → Change'}</p></div>}</div><div className="flex items-center gap-3 border-t-4 border-brand-yellow p-5"><Icon size={23} aria-hidden="true" /><h3 className="text-xl font-semibold">{title}</h3></div></article>)}</div>
      <p className="mt-5 max-w-2xl text-sm leading-relaxed text-black/65">{th ? 'รายละเอียดการใช้เงินและความต้องการปัจจุบันจะยืนยันกับ LPN ก่อนเผยแพร่แคมเปญ' : 'LPN will confirm current funding needs and how gifts are used before a campaign is published.'}</p>
    </Container></Section>

    <Section tone="dark" tight><Container className="flex flex-wrap items-center justify-between gap-6"><div><p className="eyebrow text-brand-yellow">{th ? 'องค์กรและพันธมิตร' : 'Institutions and partners'}</p><h2 className="t-h3 mt-4 text-white">{th ? 'ร่วมสนับสนุนงานระยะยาว' : 'Build a longer-term partnership'}</h2></div><ButtonLink href="/contact" variant="ghostLight">{th ? 'คุยกับ LPN' : 'Talk with LPN'}</ButtonLink></Container></Section>

    <Section tone="paper" tight><Container><details className="border border-black/15 bg-white p-6"><summary className="cursor-pointer text-lg font-semibold">{th ? 'หัวข้อสำหรับหารือกับปฏิมา' : 'Decisions to review with Patima'}</summary><div className="mt-6 grid gap-7 md:grid-cols-2"><div><h3 className="font-semibold">{th ? 'ช่องทางในประเทศไทย' : 'Thailand channel'}</h3><ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-black/70"><li>{th ? 'บัญชีมูลนิธิและ QR รับเงินที่ต้องการใช้' : 'Foundation bank account and approved payment QR.'}</li><li>{th ? 'ผู้รับผิดชอบยืนยันยอดและออกใบเสร็จ' : 'Who reconciles gifts and issues receipts.'}</li><li>{th ? 'สถานะภาษีและข้อมูลที่ต้องใช้ขอใบเสร็จ' : 'Confirmed tax status and information needed for a receipt.'}</li></ul></div><div><h3 className="font-semibold">{th ? 'ช่องทางต่างประเทศ' : 'International channel'}</h3><ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-black/70"><li>{th ? 'พันธมิตรรับเงิน ค่าธรรมเนียม และรอบโอนเงิน' : 'Receiving partner, fees, and payout schedule.'}</li><li>{th ? 'สกุลเงิน ช่องทางชำระ และการบริจาครายเดือน' : 'Currencies, payment methods, and monthly giving.'}</li><li>{th ? 'ประเทศที่ออกใบเสร็จ และผู้ดูแลความสัมพันธ์กับผู้บริจาค' : 'Receipt jurisdictions and donor relationship ownership.'}</li></ul></div></div></details></Container></Section>
  </>
}
