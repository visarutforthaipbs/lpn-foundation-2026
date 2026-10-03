import { SITE_URL } from './seo'
import type { Locale } from '@/i18n/routing'

/**
 * Single source of truth for organisational contact content shown in the UI.
 * Values follow the LIVE lpnfoundation.org site (checked 2026-09-30):
 *   - HQ: Pathum Thani (not Samut Sakhon — older materials say Samut Sakhon)
 *   - Emails: somponglpn@gmail.com / patimalpn2012@gmail.com (no info@ on live)
 *   - The live site is internally inconsistent on the Burmese line
 *     (footer shows 0963812069 on most pages, +66 34 434 726 on /donate) —
 *     both are listed here so nothing is lost; owner should confirm the canon.
 */

export type Hotline = {
  code: string
  langEn: string
  langTh: string
  /** Native-script label exactly as the live site's footer shows it. */
  langNative: string
  phone: string
}

export const HOTLINES: Hotline[] = [
  {
    code: 'TH',
    langEn: 'Thai',
    langTh: 'ภาษาไทย',
    langNative: 'ภาษาไทย',
    phone: '+66 84 121 1609',
  },
  {
    code: 'MM',
    langEn: 'Burmese',
    langTh: 'ภาษาพม่า',
    langNative: 'မြန်မာလိုပြောသည်။',
    phone: '0963812069',
  },
  {
    code: 'KH',
    langEn: 'Khmer',
    langTh: 'ภาษาเขมร',
    langNative: 'និយាយជាមួយនរណាម្នាក់ជាភាសាខ្មែរ',
    phone: '+66 85 534 1595',
  },
  {
    code: 'LA',
    langEn: 'Lao',
    langTh: 'ภาษาลาว',
    langNative: 'ເວົ້າກັບຄົນອື່ນໃນລາວ',
    phone: '+66 92 321 1516',
  },
]

/** Secondary numbers printed on the live contact page / alternate footer. */
export const ALT_LINES = {
  burmeseAlt: '+66 34 434 726',
  office1: '034 434 726',
  office2: '085 534 1595', // listed on the English contact page
  office3: '086 16 31 390', // listed on the Thai contact page
}

export const OFFICE = {
  nameEn: 'Labour Rights Promotion Network Foundation',
  nameTh: 'มูลนิธิเครือข่ายส่งเสริมคุณภาพชีวิตแรงงาน',
  addressEn:
    '1/4 Moo 9, Khubangluang Subdistrict, Lat Lum Kaeo District, Pathum Thani Province, Thailand 12140',
  addressTh: 'เลขที่ 1/4 หมู่ 9 ตำบลคูบางหลวง อำเภอลาดหลุมแก้ว จังหวัดปทุมธานี 12140',
  /** Live site prints both Gmail addresses. */
  emails: ['somponglpn@gmail.com', 'patimalpn2012@gmail.com'],
  email: 'somponglpn@gmail.com',
  phoneEn: 'Phone: 085-534-1595, 084-121-1609',
  phoneTh: 'โทรศัพท์: 085-534-1595, 084-121-1609',
  /** Live site has no office hours; it warns replies can take days. */
  noteEn:
    'For less urgent inquires, please use email. We are often in the field unexpectedly and may take a few days to respond. Thank you for your understanding.',
  noteTh:
    'สำหรับการสอบถามที่ไม่เร่งด่วน กรุณาใช้อีเมล การทำงานส่วนใหญ่ของเรา มักจะอยู่ในพื้นที่ซึ่งอาจจะทำให้ล้าช้าในการตอบกลับอยู่บ้าง',
}

/** Social links exactly as the live site uses them (two Facebook pages). */
export const SOCIALS = [
  { platform: 'Facebook', url: 'https://www.facebook.com/LPN-Foundation-1406397336075427' },
  {
    platform: 'Facebook (Thai)',
    url: 'https://www.facebook.com/Labour-Rights-Promotion-Network-371018579290',
  },
]

export const FACEBOOK_URL = 'https://www.facebook.com/LPN-Foundation-1406397336075427'

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
