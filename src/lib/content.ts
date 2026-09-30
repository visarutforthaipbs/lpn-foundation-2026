import { SITE_URL } from './seo'
import type { Locale } from '@/i18n/routing'

/**
 * Single source of truth for organisational contact content shown in the UI.
 * These are the canonical numbers/details from the live lpnfoundation.org site
 * (same values the CMS footer global is seeded with) — use these everywhere
 * instead of re-typing phone numbers per page.
 */

export type Hotline = {
  code: string
  langEn: string
  langTh: string
  phone: string
}

export const HOTLINES: Hotline[] = [
  { code: 'TH', langEn: 'Thai', langTh: 'ภาษาไทย', phone: '+66 84 121 1609' },
  { code: 'MM', langEn: 'Burmese', langTh: 'မြန်မာဘာသာ', phone: '0963812069' },
  { code: 'KH', langEn: 'Khmer', langTh: 'ភាសាខ្មែរ', phone: '+66 85 534 1595' },
  { code: 'LA', langEn: 'Lao', langTh: 'ພາສາລາວ', phone: '+66 92 321 1516' },
]

export const BANK = {
  accountName: 'Labour Rights Promotion Network',
  bankEn: 'Krungthai Bank PCL, Chamchuri Square branch',
  bankTh: 'ธนาคารกรุงไทย สาขาจามจุรีสแควร์',
  accountNumber: '162-0-09432-0',
  swift: 'KRTHTHBK',
}

export const OFFICE = {
  nameEn: 'Labour Rights Promotion Network Foundation',
  nameTh: 'มูลนิธิเครือข่ายส่งเสริมคุณภาพชีวิตแรงงาน',
  addressEn: 'Samut Sakhon, Thailand',
  addressTh: 'จังหวัดสมุทรสาคร ประเทศไทย',
  email: 'info@lpnfoundation.org',
  hoursEn: 'Mon–Fri, 09:00–17:00 ICT',
  hoursTh: 'จันทร์–ศุกร์ 09:00–17:00 น.',
}

/** Dial-ready href for a display phone number like "+66 84 121 1609". */
export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '')}`

/**
 * Share links for a blog post. Posts live under `/{locale}/post/{slug}` and
 * Thai slugs are non-ASCII — always encode the full URL.
 */
export function buildShareUrls(locale: Locale, slug: string) {
  const url = encodeURIComponent(`${SITE_URL}/${locale}/post/${encodeURIComponent(slug)}`)
  return {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    x: `https://twitter.com/intent/tweet?url=${url}`,
  }
}
