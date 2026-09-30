import englishPages from '@/seed/wix-pages.snapshot.json'
import thaiPages from '@/seed/wix-pages.th.snapshot.json'
import type { Locale } from '@/i18n/routing'

const partners = [
  { name: 'U.S. State Department – JTIP', start: 2016, end: 2019, focusEn: 'Anti-trafficking and victim assistance', focusTh: 'ปราบปรามการค้ามนุษย์และช่วยเหลือผู้เสียหาย', section: 10 },
  { name: 'Plan International', start: 2015, end: 2018, focusEn: 'Accessible services to stop exploitation', focusTh: 'บริการที่เข้าถึงได้เพื่อหยุดการแสวงหาประโยชน์', section: 12 },
  { name: 'The Freedom Fund', start: 2015, end: 2018, focusEn: 'Thailand Hotspot Project', focusTh: 'โครงการฮอตสปอตประเทศไทย', section: 14 },
  { name: 'WeWorld-GVC', start: 2017, end: 2020, focusEn: 'Rights of Cambodian migrants in Thailand', focusTh: 'สิทธิแรงงานข้ามชาติชาวกัมพูชาในไทย', section: 16 },
  { name: 'Safe Child Thailand', start: 2017, end: 2018, focusEn: 'Safety and education for at-risk children', focusTh: 'ความปลอดภัยและการศึกษาสำหรับเด็กกลุ่มเสี่ยง', section: 18 },
  { name: 'Ashoka Foundation', start: 2016, end: 2017, focusEn: 'Migrant child protection and education', focusTh: 'การคุ้มครองและการศึกษาของเด็กข้ามชาติ', section: 20 },
  { name: 'Embassy of Japan', start: 2017, end: 2018, focusEn: 'Thailand–Japan cooperation', focusTh: 'ความร่วมมือระหว่างไทยกับญี่ปุ่น', section: 22 },
] as const

export function getPartnerProjects(locale: Locale) {
  const page = (locale === 'th' ? thaiPages : englishPages).find((item) => item.slug === 'projects')
  if (!page) throw new Error('Missing Wix projects snapshot')

  return partners.map((partner) => ({
    name: partner.name,
    start: partner.start,
    end: partner.end,
    focus: locale === 'th' ? partner.focusTh : partner.focusEn,
    description: page.sections[partner.section]?.text.replace(/\u0000|\u200b/g, '').trim() ?? '',
  }))
}
