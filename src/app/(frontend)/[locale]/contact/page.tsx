import { setRequestLocale } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'
import { routing } from '@/i18n/routing'
import { getPage } from '@/lib/api'
import { buildMetadata } from '@/lib/seo'
import { ALT_LINES, OFFICE, FACEBOOK_URL, telHref } from '@/lib/content'
import { getHelpChannels } from '@/lib/help-channels'
import {
  Container,
  Section,
  SectionHeading,
  PageHero,
  CtaBand,
  ButtonLink,
  MarkLink,
} from '@/components/ui'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata(props: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await props.params
  const page = await getPage('contact', locale)
  return buildMetadata({
    locale,
    path: '/contact',
    title: page?.meta?.title || 'Contact LPN',
    description:
      page?.meta?.description ||
      'Reach LPN Foundation and our multilingual hotlines for migrant workers in Thailand.',
  })
}

// Rich bilingual language labels kept from the original page; numbers come from
// the shared content module (src/lib/content.ts) so they can't drift apart.
const LANG_LABELS: Record<string, string> = {
  TH: 'ภาษาไทย (Thai)',
  MM: 'မြန်မာဘာသာ (Burmese)',
  KH: 'ភាសាខ្មែរ (Khmer)',
  LA: 'ພາສາລາວ (Lao)',
}

export default async function ContactPage(props: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await props.params
  setRequestLocale(locale)
  const isThai = locale === 'th'
  const hotlines = await getHelpChannels(locale)

  return (
    <>
      {/* ---------------------------------------------------------------- HERO */}
      <PageHero
        compact
        eyebrow={isThai ? 'ช่องทางติดต่อเรา' : 'Get in touch'}
        title={isThai ? 'ติดต่อ LPN โดยตรง' : 'Contact LPN directly.'}
        lede={
          isThai
            ? 'สำหรับความช่วยเหลือเร่งด่วน โปรดติดต่อเราโดยตรงผ่านทางโทรศัพท์หรือส่งข้อความถึงเราบน Facebook สำหรับการสอบถามที่ไม่เร่งด่วน กรุณาใช้อีเมล การทำงานส่วนใหญ่ของเรา มักจะอยู่ในพื้นที่ซึ่งอาจจะทำให้ล้าช้าในการตอบกลับอยู่บ้าง'
            : 'For urgent assistance please call us directly or message us on facebook. For less urgent inquires, please use email. We are often in the field unexpectedly and may take a few days to respond. Thank you for your understanding.'
        }
      />

      {/* ------------------------------------------------------ HOTLINE CARDS */}
      <Section tone="yellow" className="on-light">
        <Container>
          <SectionHeading
            eyebrow={isThai ? 'การช่วยเหลือฉุกเฉิน' : 'Emergency action'}
            title={isThai ? 'หากต้องการขอความช่วยเหลือด่วน' : 'Get help now'}
            lede={
              isThai
                ? 'แจ้งความคดี ขอความช่วยเหลือ ขอข้อมูลกฎหมายแรงงาน หรือขั้นตอนการลงทะเบียนของทางราชการ ติดต่อโดยตรง เราพูดภาษาไทย เขมร ลาว และพม่า'
                : 'To report a case, request assistance, get information on labor laws or government registration process, get in touch directly. We speak Thai, Khmer, Lao & Burmese.'
            }
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {hotlines.map((h) => (
              <a key={h.code} href={telHref(h.phone)} className="card card-marked group flex flex-col p-6">
                <div className="flex items-center justify-between">
                  <span
                    className="tactile-badge h-11 w-11 text-xs font-black text-black"
                    aria-hidden="true"
                  >
                    {h.code}
                  </span>
                  <span className="t-label text-black/70">{isThai ? 'โทรเลย' : 'Tap to call'}</span>
                </div>
                <div className="mt-5 text-xs font-bold text-black/80">{LANG_LABELS[h.code]}</div>
                <div className="tactile-well mt-3 w-full px-3 py-2 text-center">
                  <span className="font-mono text-base font-black tracking-tight text-black transition-colors group-hover:underline group-hover:decoration-brand-yellow group-hover:decoration-2 group-hover:underline-offset-4">
                    {h.phone}
                  </span>
                </div>
              </a>
            ))}
          </div>
          {/* General lines printed on the live contact page */}
          <p className="mt-8 text-sm text-black/75">
            {isThai ? 'โทรศัพท์สำนักงาน: ' : 'Office lines: '}
            <a href={telHref(ALT_LINES.office1)} className="font-mono font-bold text-black underline decoration-brand-yellow underline-offset-4">
              {ALT_LINES.office1}
            </a>
            {' · '}
            <a
              href={telHref(isThai ? ALT_LINES.office3 : ALT_LINES.office2)}
              className="font-mono font-bold text-black underline decoration-brand-yellow underline-offset-4"
            >
              {isThai ? ALT_LINES.office3 : ALT_LINES.office2}
            </a>
          </p>
        </Container>
      </Section>

      {/* ------------------------------------------------------------- FACEBOOK */}
      <Section tone="dark" className="border-y border-white/10">
        <Container>
          <div className="grid gap-10 md:grid-cols-2">
            <article className="glass-dark relative rounded p-8">
              <span className="absolute top-0 left-0 h-1.5 w-12 bg-brand-yellow" aria-hidden="true" />
              <div className="t-label text-brand-yellow">
                {isThai ? 'เชื่อมต่อบน Facebook' : 'Connect on Facebook'}
              </div>
              <h2 className="t-h3 mt-3 text-white">{isThai ? 'ส่งข้อความหาเรา' : 'Message us on Facebook'}</h2>
              <p className="mt-4 text-sm leading-relaxed text-white/75">
                {isThai
                  ? 'หากต้องการเรียนรู้เพิ่มเติมเกี่ยวกับ LPN ถามคำถามเกี่ยวกับงานของเรา หรือขอเข้าร่วมการประชุมหรืออภิปราย โปรดติดต่อเราทางอีเมลที่ลิงก์ด้านล่าง'
                  : 'To learn more about LPN, ask questions about our work, or request attendance in conferences or panel discussions, please contact us by email at the link below.'}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <ButtonLink href={FACEBOOK_URL} variant="primary">
                  {isThai ? 'ติดต่อเราได้ที่ Facebook' : 'Message us on Facebook'}
                </ButtonLink>
                <ButtonLink href={`mailto:${OFFICE.email}`} variant="ghostLight">
                  {isThai ? 'ส่งอีเมลตอนนี้' : 'Email now'}
                </ButtonLink>
              </div>
            </article>
            <article className="glass-dark relative rounded p-8">
              <span className="absolute top-0 left-0 h-1.5 w-12 bg-brand-yellow" aria-hidden="true" />
              <div className="t-label text-brand-yellow">
                {isThai ? 'สำนักงานใหญ่ประเทศไทย' : 'Thailand Headquarters'}
              </div>
              <h2 className="t-h3 mt-3 text-white">
                {isThai ? OFFICE.nameTh : OFFICE.nameEn}
              </h2>
              <address className="mt-4 text-sm leading-relaxed text-white/75 not-italic">
                {isThai ? OFFICE.addressTh : OFFICE.addressEn}
              </address>
              <p className="mt-4 font-mono text-sm text-white/85">
                {isThai ? OFFICE.phoneTh : OFFICE.phoneEn}
              </p>
              <ul className="mt-3">
                {OFFICE.emails.map((e) => (
                  <li key={e}>
                    <MarkLink href={`mailto:${e}`} className="text-white hover:text-brand-yellow">
                      {e}
                    </MarkLink>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </Container>
      </Section>

      {/* ---------------------------------------------------------------- CTA */}
      <CtaBand
        heading={isThai ? 'ไม่ใช่กรณีฉุกเฉิน?' : 'Not an emergency?'}
        body={
          isThai
            ? 'เรียนรู้บริการของเราหรือร่วมสนับสนุนงานของ LPN'
            : 'Explore what we do, or help fund the work.'
        }
        actions={
          <>
            <ButtonLink href="/services" variant="solidDark">
              {isThai ? 'บริการของเรา' : 'See our services'}
            </ButtonLink>
            <ButtonLink href="/donate" variant="ghostDark">
              {isThai ? 'บริจาค' : 'Donate'}
            </ButtonLink>
          </>
        }
      />
    </>
  )
}
