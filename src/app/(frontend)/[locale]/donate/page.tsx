import { setRequestLocale } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'
import { getFooter, getPage } from '@/lib/api'
import { buildMetadata } from '@/lib/seo'
import { ButtonLink, Container, Section, SectionHeading } from '@/components/ui'

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

export default async function DonatePage(props: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await props.params
  setRequestLocale(locale)
  const th = locale === 'th'
  const footer = await getFooter(locale)
  const bankVerified = Boolean(footer.bankVerifiedAt && footer.bankVerifiedBy && footer.bankAccountName && footer.bankName && footer.bankAccountNumber)
  const streams = th ? [
    ['ช่วยเหลือและคุ้มครอง', 'ช่วยให้ LPN รับฟังและประสานความช่วยเหลือสำหรับแรงงานและครอบครัวที่เผชิญปัญหา'],
    ['ความรู้และชุมชน', 'สนับสนุนการเรียนรู้เรื่องสิทธิ เยาวชน ครอบครัว และเครือข่ายแรงงาน'],
    ['หลักฐานและการเปลี่ยนระบบ', 'สนับสนุนงานวิจัยและความร่วมมือที่ใช้ประสบการณ์ภาคสนามเพื่อแก้ปัญหาเชิงระบบ'],
  ] : [
    ['Respond and protect', 'Help LPN listen and connect workers and families facing problems with appropriate support.'],
    ['Learn with communities', 'Support rights learning, young people, families, and worker networks.'],
    ['Build evidence for change', 'Support research and partnerships that use field experience to address systemic barriers.'],
  ]

  return <>
    <Section tone="dark"><Container>
      <p className="eyebrow text-brand-yellow">{th ? 'ร่วมสนับสนุน' : 'Support LPN'}</p>
      <h1 className="t-display mt-6 max-w-5xl text-white">{th ? 'ช่วยให้สิทธิและการคุ้มครองเข้าถึงทุกคน' : 'Help make rights and protection reachable.'}</h1>
      <p className="t-lede mt-7 max-w-3xl text-white/80">{th
        ? 'การสนับสนุนของคุณช่วยให้งานช่วยเหลือ การสร้างความรู้ และการเปลี่ยนแปลงระบบดำเนินต่อไป'
        : 'Your support helps sustain direct assistance, community learning, and systems change.'}</p>
      <div className="mt-9 flex flex-wrap gap-3">
        <ButtonLink href={bankVerified ? '#bank-details' : '/contact'} variant="primary">{bankVerified ? (th ? 'ดูข้อมูลโอนเงิน' : 'See bank details') : (th ? 'สอบถามการสนับสนุน' : 'Ask about giving')}</ButtonLink>
        <ButtonLink href="/impact" variant="ghostLight">{th ? 'ดูผลการทำงาน' : 'Explore impact'}</ButtonLink>
      </div>
    </Container></Section>

    <Section tone="paper"><Container>
      <SectionHeading eyebrow={th ? 'การสนับสนุนของคุณ' : 'Where support helps'} title={th ? 'สามด้านของงานที่เชื่อมกัน' : 'Three connected parts of the work'} lede={th ? 'ความต้องการปัจจุบันและข้อจำกัดของทุนควรตกลงกับทีม LPN ก่อนสนับสนุนโครงการเฉพาะ' : 'Discuss current needs and any funding restrictions with LPN before supporting a specific programme.'} />
      <div className="mt-10 grid gap-5 md:grid-cols-3">{streams.map(([title, body], i) => <article key={title} className="border-t-4 border-brand-yellow bg-white p-7">
        <span className="t-label text-black/70">0{i + 1}</span><h3 className="t-h3 mt-5">{title}</h3><p className="mt-4 text-sm leading-relaxed text-black/75">{body}</p>
      </article>)}</div>
    </Container></Section>

    <Section tone="light"><Container className="grid gap-10 lg:grid-cols-2">
      <div>
        <SectionHeading eyebrow={th ? 'บริจาค' : 'Individual giving'} title={th ? 'ร่วมบริจาค' : 'Make a gift'} lede={th ? 'ติดต่อ LPN เพื่อยืนยันช่องทางและรายละเอียดการบริจาคล่าสุด รวมถึงใบเสร็จหรือเอกสารที่ต้องการ' : 'Contact LPN to confirm current payment details and ask about receipts or documentation.'} />
        <div className="mt-7"><ButtonLink href="/contact" variant="solidDark">{th ? 'ติดต่อ LPN' : 'Contact LPN'}</ButtonLink></div>
      </div>
      <div>
        <SectionHeading eyebrow={th ? 'องค์กรและพันธมิตร' : 'Institutions and partners'} title={th ? 'ร่วมงานอย่างรับผิดชอบ' : 'Partner responsibly'} lede={th ? 'พูดคุยเรื่องทุนวิจัย การศึกษา หรือการคุ้มครองแรงงาน โดยคำนึงถึงความลับ ความปลอดภัยของแรงงาน และความเป็นอิสระในการทำงานของ LPN' : 'Discuss research, education, or worker-protection support while respecting confidentiality, worker safety, and LPN’s independence.'} />
        <div className="mt-7"><ButtonLink href="/contact" variant="solidDark">{th ? 'คุยเรื่องความร่วมมือ' : 'Discuss a partnership'}</ButtonLink></div>
      </div>
    </Container></Section>

    {bankVerified && <Section tone="dark" id="bank-details" className="scroll-mt-24"><Container>
      <SectionHeading eyebrow={th ? 'รายละเอียดที่ยืนยันแล้ว' : 'Verified details'} title={th ? 'โอนเงินผ่านธนาคาร' : 'Bank transfer'} tone="light" />
      <dl className="mt-8 grid max-w-2xl gap-4">{[
        [th ? 'ชื่อบัญชี' : 'Account name', footer.bankAccountName],
        [th ? 'ธนาคาร' : 'Bank', footer.bankName],
        [th ? 'เลขที่บัญชี' : 'Account number', footer.bankAccountNumber],
        ['SWIFT', footer.bankSwift],
      ].filter(([, value]) => value).map(([label, value]) => <div key={label} className="border-b border-white/20 pb-3"><dt className="t-label text-white/70">{label}</dt><dd className="mt-2 font-mono text-lg font-bold text-white">{value}</dd></div>)}</dl>
      <p className="mt-7 text-sm text-white/70">{th ? `ยืนยันโดย ${footer.bankVerifiedBy} เมื่อ ${new Date(footer.bankVerifiedAt!).toLocaleDateString('th-TH')}` : `Verified by ${footer.bankVerifiedBy} on ${new Date(footer.bankVerifiedAt!).toLocaleDateString('en')}`}</p>
    </Container></Section>}
  </>
}
