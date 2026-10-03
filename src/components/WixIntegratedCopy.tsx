import type { Locale } from '@/i18n/routing'
import { getPage } from '@/lib/api'
import { RenderBlocks } from './RenderBlocks'

/** Render additional Wix copy that editors have integrated into a core page. */
export async function WixIntegratedCopy({ slug, locale }: { slug: string; locale: Locale }) {
  const page = await getPage(slug, locale)
  const blockName = locale === 'th' ? 'Wix integrated copy (th)' : 'Wix integrated copy'
  const blocks = page?.layout?.filter((block) => block.blockName === blockName)
  if (!blocks?.length) return null
  return <RenderBlocks blocks={blocks} locale={locale} />
}
