/** Set the PRD's primary journeys in Payload, retaining row IDs across locales. */
import './loadenv'
import { getPayload } from 'payload'
import config from '../payload.config'

const items = [
  { href: '/get-help', en: 'Get Help', th: 'ขอความช่วยเหลือ' },
  { href: '/our-work', en: 'Our Work', th: 'งานของเรา' },
  { href: '/impact', en: 'Impact & Reports', th: 'ผลการทำงานและรายงาน' },
  { href: '/about', en: 'About', th: 'เกี่ยวกับเรา' },
  { href: '/blog', en: 'News', th: 'ข่าวสาร' },
] as const

async function main() {
  const payload = await getPayload({ config })
  const before = await payload.findGlobal({ slug: 'header', locale: 'en' })
  const enRows = items.map((item) => ({
    href: item.href,
    label: item.en,
    id: before.navItems?.find((row) => row.href === item.href)?.id,
  }))
  await payload.updateGlobal({ slug: 'header', locale: 'en', data: {
    navItems: enRows, donateHref: '/donate', donateLabel: 'Donate',
  } })
  const saved = await payload.findGlobal({ slug: 'header', locale: 'en' })
  await payload.updateGlobal({ slug: 'header', locale: 'th', data: {
    navItems: items.map((item) => ({
      href: item.href,
      label: item.th,
      id: saved.navItems?.find((row) => row.href === item.href)?.id,
    })),
    donateHref: '/donate', donateLabel: 'บริจาค',
  } })
  payload.logger.info('PRD navigation is available in both CMS locales.')
  process.exit(0)
}

void main()
