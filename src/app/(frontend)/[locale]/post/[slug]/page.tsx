import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { routing, type Locale } from '@/i18n/routing'
import { getPost, getAllPostSlugs } from '@/lib/api'
import { MediaImage } from '@/components/MediaImage'
import { RichText } from '@/components/RichText'
import { buildMetadata } from '@/lib/seo'

export async function generateMetadata(props: {
  params: Promise<{ locale: Locale; slug: string }>
}) {
  const { locale, slug: raw } = await props.params
  const slug = decodeURIComponent(raw) // non-ASCII (Thai) slugs arrive percent-encoded
  const post = await getPost(slug, locale)
  if (!post) return {}
  const cover = post.coverImage && typeof post.coverImage !== 'number' ? post.coverImage.url : undefined
  return buildMetadata({
    locale,
    path: `/post/${slug}`,
    title: post.meta?.title || post.title,
    description: post.meta?.description || post.excerpt || undefined,
    image: cover ?? undefined,
  })
}

export async function generateStaticParams() {
  // Each post is prerendered only under its own language's locale.
  const posts = await getAllPostSlugs()
  return posts.map(({ slug, language }) => ({ locale: language, slug }))
}

export default async function PostPage(props: {
  params: Promise<{ locale: Locale; slug: string }>
}) {
  const { locale, slug: raw } = await props.params
  const slug = decodeURIComponent(raw)
  setRequestLocale(locale)

  const post = await getPost(slug, locale)
  if (!post) notFound()

  const author = post.author && typeof post.author !== 'number' ? post.author : null

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      {post.category && typeof post.category !== 'number' && (
        <span className="mb-3 inline-block w-fit rounded bg-brand-yellow px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider text-black">
          {post.category.title}
        </span>
      )}
      <h1 className="mt-2 text-4xl font-bold leading-tight text-black">{post.title}</h1>

      <div className="mt-4 flex items-center gap-3 text-sm text-black/60">
        {author && <span>{author.name}</span>}
        {author && post.publishedAt && <span>·</span>}
        {post.publishedAt && (
          <time dateTime={post.publishedAt}>
            {new Date(post.publishedAt).toLocaleDateString(locale, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        )}
      </div>

      {post.coverImage && typeof post.coverImage !== 'number' ? (
        <MediaImage media={post.coverImage} className="my-8 w-full rounded-xl object-cover" sizes="(max-width:768px) 100vw, 768px" priority />
      ) : null}

      <RichText data={post.content} className="mt-6" />
    </article>
  )
}
