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
  const isThai = locale === 'th'

  const t = await getTranslations('nav')
  const [{ docs: posts }, categories] = await Promise.all([
    getPosts(locale, { categorySlug: category }),
    getCategories(locale),
  ])

  const activeCategory = category ? categories.find((c) => c.slug === category) : null
  const [featured, ...rest] = posts

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' })

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-white/10 bg-black text-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: 'url(/images/trawler-hero.jpg)' }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/70 to-black/30" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 md:py-28">
          <div className="max-w-3xl">
            <span className="inline-flex rounded glass-tag px-3 py-1 text-[10px] font-black uppercase tracking-[0.25em] text-brand-yellow">
              {isThai ? 'บล็อก & ข่าวสาร' : 'Field dispatches'}
            </span>
            <h1 className="mt-6 text-4xl font-black leading-[1.05] tracking-tight text-balance md:text-6xl">
              {activeCategory
                ? activeCategory.title
                : isThai
                  ? 'รายงานจากแนวหน้า เรื่องเล่าของผู้รอด และเสียงจากแรงงาน'
                  : 'Frontline reports, survivor stories, and worker voices.'}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/85 md:text-lg">
              {isThai
                ? 'อ่านบทความ ข่าวสาร และผลงานวิจัยจากทีม LPN และเครือข่ายของเรา'
                : t('blog')
                  ? 'Articles, press, and field updates from the LPN team and our network.'
                  : ''}
            </p>
          </div>

          <dl className="mt-12 grid max-w-2xl grid-cols-3 gap-4 border-l-4 border-brand-yellow pl-6">
            <div>
              <dt className="text-[10px] font-bold uppercase tracking-widest text-white/55">
                {isThai ? 'บทความ' : 'Posts'}
              </dt>
              <dd className="mt-1 text-2xl font-black md:text-3xl">{posts.length}</dd>
            </div>
            <div>
              <dt className="text-[10px] font-bold uppercase tracking-widest text-white/55">
                {isThai ? 'หมวดหมู่' : 'Categories'}
              </dt>
              <dd className="mt-1 text-2xl font-black md:text-3xl">{categories.length}</dd>
            </div>
            <div>
              <dt className="text-[10px] font-bold uppercase tracking-widest text-white/55">
                {isThai ? 'ภาษา' : 'Languages'}
              </dt>
              <dd className="mt-1 text-2xl font-black md:text-3xl">2</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* CATEGORY FILTER STRIP */}
      <section className="border-b border-black bg-brand-yellow text-black">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-4 py-4">
          <span className="mr-3 text-[10px] font-black uppercase tracking-[0.25em]">
            {isThai ? 'กรองตาม' : 'Filter'}
          </span>
          <Link
            href="/blog"
            className={`rounded border px-4 py-1.5 text-[11px] font-black uppercase tracking-widest transition-all ${
              !category
                ? 'border-black bg-black text-brand-yellow'
                : 'border-black/40 bg-transparent text-black hover:bg-black hover:text-brand-yellow hover:border-black'
            }`}
          >
            {isThai ? 'ทั้งหมด' : 'All'}
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              href={{ pathname: '/blog', query: { category: c.slug } }}
              className={`rounded border px-4 py-1.5 text-[11px] font-black uppercase tracking-widest transition-all ${
                category === c.slug
                  ? 'border-black bg-black text-brand-yellow'
                  : 'border-black/40 bg-transparent text-black hover:bg-black hover:text-brand-yellow hover:border-black'
              }`}
            >
              {c.title}
            </Link>
          ))}
        </div>
      </section>

      {/* POSTS */}
      <section className="border-b border-black bg-white py-16 text-black md:py-20">
        <div className="mx-auto max-w-7xl px-4">
          {posts.length === 0 ? (
            <div className="border border-black/15 bg-white p-12 text-center">
              <p className="text-sm font-bold uppercase tracking-widest text-black/55">
                {isThai ? 'ยังไม่มีบทความในหมวดนี้' : 'No posts in this category yet.'}
              </p>
            </div>
          ) : (
            <>
              {/* Featured post */}
              {featured && (
                <Link
                  href={`/post/${featured.slug}`}
                  className="group mb-12 grid overflow-hidden rounded border border-black bg-white transition-all duration-300 hover:-translate-y-1 md:grid-cols-2"
                >
                  <div className="relative aspect-4/3 overflow-hidden bg-black md:aspect-auto">
                    {featured.coverImage && typeof featured.coverImage !== 'number' ? (
                      <MediaImage
                        media={featured.coverImage}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width:768px) 100vw, 50vw"
                        priority
                      />
                    ) : (
                      <div className="h-full w-full bg-black/10" />
                    )}
                    <span className="absolute top-4 left-4 inline-flex rounded glass-tag px-3 py-1 text-[10px] font-black uppercase tracking-[0.25em] text-brand-yellow">
                      {isThai ? 'บทความเด่น' : 'Featured'}
                    </span>
                  </div>
                  <div className="relative flex flex-col justify-between p-8 md:p-10">
                    <div className="absolute top-0 left-0 h-full w-1.5 bg-brand-yellow md:left-0" />
                    <div className="pl-3">
                      {featured.category && typeof featured.category !== 'number' && (
                        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-black/45">
                          {featured.category.title}
                        </span>
                      )}
                      <h2 className="mt-3 text-2xl font-black uppercase leading-tight tracking-tight text-black md:text-4xl">
                        {featured.title}
                      </h2>
                      {featured.excerpt && (
                        <p className="mt-4 line-clamp-4 text-sm leading-relaxed text-black/75 md:text-base">
                          {featured.excerpt}
                        </p>
                      )}
                    </div>
                    <div className="mt-8 flex items-center justify-between pl-3">
                      {featured.publishedAt && (
                        <span className="text-[10px] font-bold uppercase tracking-widest text-black/55">
                          {formatDate(featured.publishedAt)}
                        </span>
                      )}
                      <span className="inline-flex items-center text-[11px] font-black uppercase tracking-widest text-black border-b-2 border-brand-yellow pb-0.5 transition-colors group-hover:border-black">
                        {isThai ? 'อ่านบทความ →' : 'Read article →'}
                      </span>
                    </div>
                  </div>
                </Link>
              )}

              {/* Rest */}
              {rest.length > 0 && (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {rest.map((post) => (
                    <Link
                      key={post.id}
                      href={`/post/${post.slug}`}
                      className="group relative flex flex-col overflow-hidden rounded border border-black bg-white transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="relative aspect-video overflow-hidden bg-black/5">
                        {post.coverImage && typeof post.coverImage !== 'number' ? (
                          <MediaImage
                            media={post.coverImage}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width:1024px) 100vw, 33vw"
                          />
                        ) : (
                          <div className="h-full w-full bg-black/10" />
                        )}
                      </div>
                      <div className="relative flex flex-1 flex-col p-6">
                        <span className="absolute top-0 left-0 h-full w-1.5 bg-brand-yellow" />
                        <div className="pl-3">
                          {post.category && typeof post.category !== 'number' && (
                            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-black/45">
                              {post.category.title}
                            </span>
                          )}
                          <h3 className="mt-2 text-base font-black uppercase leading-tight tracking-tight text-black">
                            {post.title}
                          </h3>
                          {post.excerpt && (
                            <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-black/75">
                              {post.excerpt}
                            </p>
                          )}
                        </div>
                        <div className="mt-auto flex items-center justify-between pt-6 pl-3">
                          {post.publishedAt && (
                            <span className="text-[10px] font-bold uppercase tracking-widest text-black/55">
                              {formatDate(post.publishedAt)}
                            </span>
                          )}
                          <span className="text-[10px] font-black uppercase tracking-widest text-black border-b border-brand-yellow pb-0.5 transition-colors group-hover:border-black">
                            {isThai ? 'อ่าน →' : 'Read →'}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-yellow py-16 text-black">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-black uppercase tracking-tight md:text-4xl">
              {isThai ? 'งานของเราขับเคลื่อนด้วยผู้สนับสนุน' : 'Our reporting is reader-funded.'}
            </h2>
            <p className="mt-3 text-sm text-black/80 md:text-base">
              {isThai
                ? 'การบริจาคของคุณช่วยให้ทีมภาคสนามของเราเดินทาง รายงาน และนำเรื่องราวของแรงงานไปสู่สาธารณะ'
                : 'Your support keeps our field team reporting and bringing worker voices into public view.'}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/donate"
              className="rounded bg-black px-6 py-3 text-xs font-black uppercase tracking-widest text-brand-yellow transition-all hover:bg-white hover:text-black border border-black"
            >
              {isThai ? 'บริจาค' : 'Donate'}
            </Link>
            <Link
              href="/contact"
              className="rounded border border-black bg-transparent px-6 py-3 text-xs font-black uppercase tracking-widest text-black transition-all hover:bg-black hover:text-brand-yellow"
            >
              {isThai ? 'ติดต่อทีมข่าว' : 'Contact newsroom'}
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
