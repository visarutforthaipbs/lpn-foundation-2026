import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { routing, type Locale } from '@/i18n/routing'
import { getPage, getAllPageSlugs } from '@/lib/api'
import { RenderBlocks } from '@/components/RenderBlocks'
import { buildMetadata } from '@/lib/seo'

export async function generateMetadata(props: {
  params: Promise<{ locale: Locale; slug: string }>
}) {
  const { locale, slug: raw } = await props.params
  const slug = decodeURIComponent(raw)
  const page = await getPage(slug, locale)
  if (!page) return {}
  return buildMetadata({
    locale,
    path: `/${slug}`,
    title: page.meta?.title || page.title,
    description: page.meta?.description ?? undefined,
  })
}

// Reserved by their own route folders — never resolve them as a generic page.
const RESERVED = new Set(['home', 'blog', 'post'])

export async function generateStaticParams() {
  const slugs = (await getAllPageSlugs()).filter((s) => !RESERVED.has(s))
  return routing.locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })))
}

export default async function GenericPage(props: {
  params: Promise<{ locale: Locale; slug: string }>
}) {
  const { locale, slug: raw } = await props.params
  const slug = decodeURIComponent(raw)
  if (RESERVED.has(slug)) notFound()
  setRequestLocale(locale)

  const page = await getPage(slug, locale)
  if (!page) notFound()

  return (
    <>
      {/* If the page has no hero block, show its title as a simple header. */}
      {!page.layout?.some((b) => b.blockType === 'hero') && (
        <div className="bg-black py-16 text-white">
          <h1 className="mx-auto max-w-6xl px-4 text-4xl font-bold">{page.title}</h1>
        </div>
      )}
      <RenderBlocks blocks={page.layout} locale={locale} />
    </>
  )
}
