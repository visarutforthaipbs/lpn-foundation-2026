import type { Locale } from '@/i18n/routing'
import { HOTLINES } from './content'
import { getFooter } from './api'

/** One CMS-backed source for the numbers shown on the main worker journey. */
export async function getHelpChannels(locale: Locale) {
  const footer = await getFooter(locale)
  return HOTLINES.map((channel) => {
    const name = channel.code === 'TH' ? /thai|ไทย/i
      : channel.code === 'MM' ? /burmese|myanmar|พม่า|မြန်မာ/i
      : channel.code === 'KH' ? /khmer|เขมร|ខ្មែរ/i
      : /lao|ลาว|ລາວ/i
    const edited = footer.hotlines?.find((entry) => name.test(entry.language))
    return { ...channel, phone: edited?.phone || channel.phone, verifiedAt: edited?.verifiedAt, verifiedBy: edited?.verifiedBy }
  })
}
