import type { Locale } from '@/i18n/routing'
import { getPage } from '@/lib/api'
import { RenderBlocks } from './RenderBlocks'

/** Render additional Wix copy that editors have integrated into a core page. */
export async function WixIntegratedCopy({ slug, locale }: { slug: string; locale: Locale }) {
  // The former Wix pages are English-only. Keep the existing Thai copy intact.
  if (locale !== 'en') return null
  const page = await getPage(slug, locale)
  const blocks = page?.layout?.filter((block) => block.blockName === 'Wix integrated copy')
  if (!blocks?.length) return null
  return <RenderBlocks blocks={blocks} locale={locale} />
}
