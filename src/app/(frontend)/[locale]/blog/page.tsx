import { setRequestLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { getPosts, getCategories } from '@/lib/api'
import { MediaImage } from '@/components/MediaImage'

export default async function BlogIndex(props: {
  params: Promise<{ locale: Locale }>
  searchParams: Promise<{ category?: string }>
}) {
  const { locale } = await props.params
  const { category } = await props.searchParams
  setRequestLocale(locale)

  const t = await getTranslations('nav')
  const [{ docs: posts }, categories] = await Promise.all([
    getPosts(locale, { categorySlug: category }),
    getCategories(locale),
  ])

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-6 text-4xl font-bold text-black">{t('blog')}</h1>

      {/* Category filter */}
      <div className="mb-10 flex flex-wrap gap-2">
        <Link
          href="/blog"
          className={`rounded-full px-4 py-1.5 text-sm border border-black font-semibold transition-all ${!category ? 'bg-brand-yellow text-black' : 'bg-white text-black hover:bg-black hover:text-white'}`}
        >
          All
        </Link>
        {categories.map((c) => (
          <Link
            key={c.id}
            href={{ pathname: '/blog', query: { category: c.slug } }}
            className={`rounded-full px-4 py-1.5 text-sm border border-black font-semibold transition-all ${category === c.slug ? 'bg-brand-yellow text-black' : 'bg-white text-black hover:bg-black hover:text-white'}`}
          >
            {c.title}
          </Link>
        ))}
      </div>

      {posts.length === 0 ? (
        <p className="text-black">No posts yet.</p>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/post/${post.slug}`}
              className="group flex flex-col overflow-hidden rounded-xl border border-black bg-white transition hover:-translate-y-1 hover:shadow-sm"
            >
              {post.coverImage && typeof post.coverImage !== 'number' ? (
                <MediaImage
                  media={post.coverImage}
                  className="aspect-video w-full object-cover"
                  sizes="(max-width:1024px) 100vw, 33vw"
                />
              ) : (
                <div className="aspect-video w-full bg-black/10" />
              )}
              <div className="flex flex-1 flex-col p-5">
                {post.category && typeof post.category !== 'number' && (
                  <span className="mb-3 inline-block w-fit rounded bg-brand-yellow px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-black">
                    {post.category.title}
                  </span>
                )}
                <h2 className="text-lg font-bold text-black group-hover:text-brand-yellow transition-colors">
                  {post.title}
                </h2>
                {post.excerpt && <p className="mt-2 line-clamp-3 text-sm text-black/75">{post.excerpt}</p>}
                {post.publishedAt && (
                  <span className="mt-auto pt-4 text-xs text-black/60 font-semibold">
                    {new Date(post.publishedAt).toLocaleDateString(locale, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
