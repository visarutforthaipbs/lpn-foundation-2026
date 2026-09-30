import { setRequestLocale } from 'next-intl/server'
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
  const issues = th
    ? ['ค่าจ้างและสภาพการทำงาน', 'เอกสารและการเดินทาง', 'ความปลอดภัยหรือการถูกเอาเปรียบ', 'สุขภาพและการรักษาพยาบาล', 'เด็ก การศึกษา และครอบครัว']
    : ['Pay and working conditions', 'Documents and migration', 'Safety or exploitation', 'Health and access to care', 'Children, education, and family']

  return <>
    <Section tone="dark" tight><Container>
      <p className="eyebrow text-brand-yellow">{th ? 'ขอความช่วยเหลือ' : 'Get help'}</p>
      <h1 className="t-display mt-6 max-w-5xl text-white">{th ? 'ติดต่อ LPN หรือเรียนรู้สิทธิของคุณ' : 'Contact LPN or learn your rights.'}</h1>
      <p className="t-lede mt-7 max-w-3xl text-white/80">{th
        ? 'หากกำลังเผชิญปัญหา คุณติดต่อ LPN ได้โดยตรง ไม่ต้องอ่านคู่มือหรือกรอกแบบฟอร์มก่อน หากต้องการหาข้อมูลด้วยตัวเอง เปิดคู่มือรู้สิทธิได้ด้านล่าง'
        : 'If you are facing a problem, you can contact LPN directly. You do not have to read a guide or complete a form first. If you want to explore information yourself, use the Rights Guide below.'}</p>
      <div className="mt-9"><ButtonLink href={telHref(hotlines[0].phone)} variant="primary">{th ? `โทร LPN ${hotlines[0].phone}` : `Call LPN ${hotlines[0].phone}`}</ButtonLink></div>
    </Container></Section>

    <Section tone="yellow" id="contact"><Container>
      <SectionHeading eyebrow={th ? 'ติดต่อโดยตรง' : 'Direct contact'} title={th ? 'เลือกหมายเลขตามภาษาที่ต้องการ' : 'Choose a number for your language'} lede={th ? 'กดหมายเลขเพื่อโทรจากโทรศัพท์ของคุณ' : 'Tap a number to call from your phone.'} />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{hotlines.map((h) => <a
        key={h.code} href={telHref(h.phone)}
        className="flex min-h-32 flex-col justify-between border-2 border-black bg-white p-5 transition-colors hover:bg-black hover:text-white focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-black"
        aria-label={`${th ? h.langTh : h.langEn}: ${h.phone}`}
      >
        <span className="font-bold">{th ? h.langTh : h.langEn}</span>
        <span className="mt-6 font-mono text-xl font-black">{h.phone}</span>
      </a>)}</div>
      <p className="mt-6 max-w-3xl text-sm leading-relaxed text-black/80">{th
        ? 'หมายเลขเหล่านี้มาจากข้อมูลติดต่อของ LPN หากโทรไม่ติดหรือไม่แน่ใจว่าจะใช้หมายเลขใด ดูช่องทางอื่นในหน้าติดต่อ'
        : 'These numbers are from LPN’s published contact information. If a call does not connect or you are unsure which number to use, see other contact options.'}{' '}
        <a className="font-bold underline underline-offset-4" href={`/${locale}/contact`}>{th ? 'ดูหน้าติดต่อ' : 'View contact page'}</a>
      </p>
    </Container></Section>

    <Section tone="light"><Container>
      <SectionHeading eyebrow={th ? 'เริ่มจากปัญหาของคุณ' : 'Start with your situation'} title={th ? 'เรื่องที่คุณอาจต้องการพูดคุย' : 'What might you need to discuss?'} lede={th ? 'ตัวอย่างเหล่านี้ช่วยให้คุณเริ่มอธิบายปัญหาได้ คุณไม่จำเป็นต้องเลือกหมวดหมู่ก่อนโทร' : 'These examples may help you explain your situation. You do not need to choose a category before calling.'} />
      <ul className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{issues.map((issue) => <li key={issue} className="border-l-4 border-brand-yellow bg-paper p-5 text-sm font-semibold leading-relaxed">{issue}</li>)}</ul>
    </Container></Section>

    <Section tone="paper"><Container className="grid gap-9 lg:grid-cols-[1fr_auto] lg:items-center">
      <div>
        <SectionHeading eyebrow={th ? 'เรียนรู้ด้วยตัวเอง' : 'Learn at your own pace'} title={th ? 'รู้สิทธิ ติดกระเป๋า' : 'LPN Rights Guide'} lede={th
          ? 'ค้นหาข้อมูลเรื่องสิทธิแรงงาน เอกสาร สุขภาพ และครอบครัวตามสถานการณ์ของคุณ คู่มือมีภาษาไทย อังกฤษ และพม่า และไม่ใช่เงื่อนไขในการติดต่อ LPN'
          : 'Explore rights information about work, documents, health, and family through situations relevant to you. The guide offers Thai, English, and Burmese, and is never required before contacting LPN.'} />
      </div>
      <ButtonLink href={GUIDE} variant="solidDark">{th ? 'เปิดคู่มือรู้สิทธิ' : 'Open the Rights Guide'}</ButtonLink>
    </Container></Section>
  </>
}
