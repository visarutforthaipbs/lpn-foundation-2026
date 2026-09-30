import { setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { getPosts, getCategories } from '@/lib/api'
import { MediaImage } from '@/components/MediaImage'
import { Container, Section, StatBand, ButtonLink, CtaBand, Eyebrow } from '@/components/ui'

export default async function BlogIndex(props: {
  params: Promise<{ locale: Locale }>
  searchParams: Promise<{ category?: string }>
}) {
  const { locale } = await props.params
  const { category } = await props.searchParams
  setRequestLocale(locale)
  const isThai = locale === 'th'

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
      {/* ------------------------------------------------------- COMPACT HERO */}
      <section className="relative isolate overflow-hidden bg-black text-white">
        <div className="container-page relative z-10 py-16 md:py-20">
          <div className="max-w-3xl">
            <Eyebrow>{isThai ? 'บล็อก & ข่าวสาร' : 'Field dispatches'}</Eyebrow>
            <h1 className="t-display-sm mt-6">
              {activeCategory
                ? activeCategory.title
                : isThai
                  ? 'รายงานจากแนวหน้า เรื่องเล่าของผู้รอด และเสียงจากแรงงาน'
                  : 'Frontline reports, survivor stories, and worker voices.'}
            </h1>
            <p className="t-lede mt-6 max-w-2xl text-white/85">
              {isThai
                ? 'อ่านบทความ ข่าวสาร และผลงานวิจัยจากทีม LPN และเครือข่ายของเรา'
                : 'Articles, press, and field updates from the LPN team and our network.'}
            </p>
          </div>

          <StatBand
            tone="dark"
            className="mt-12 max-w-2xl border-l-4 border-brand-yellow pl-6"
            stats={[
              { value: String(posts.length), label: isThai ? 'บทความ' : 'Posts' },
              { value: String(categories.length), label: isThai ? 'หมวดหมู่' : 'Categories' },
              { value: '2', label: isThai ? 'ภาษา' : 'Languages' },
            ]}
          />
        </div>
      </section>

      {/* --------------------------------------------------- CATEGORY FILTERS */}
      <div className="border-b border-black bg-brand-yellow text-black on-light">
        <div className="container-page flex flex-wrap items-center gap-2 py-4">
          <span className="t-label mr-3">{isThai ? 'กรองตาม' : 'Filter'}</span>
          <Link
            href="/blog"
            className={`tactile-pill min-h-11 px-4 text-[11px] font-black tracking-widest uppercase ${
              !category ? 'active' : 'text-black'
            }`}
          >
            {isThai ? 'ทั้งหมด' : 'All'}
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              href={{ pathname: '/blog', query: { category: c.slug } }}
              className={`tactile-pill min-h-11 px-4 text-[11px] font-black tracking-widest uppercase ${
                category === c.slug ? 'active' : 'text-black'
              }`}
            >
              {c.title}
            </Link>
          ))}
        </div>
      </div>

      {/* -------------------------------------------------------------- POSTS */}
      <Section tone="light" className="on-light">
        <Container>
          {posts.length === 0 ? (
            <div className="border border-black/15 bg-paper p-12 text-center">
              <p className="t-label-lg text-black/70">
                {isThai ? 'ยังไม่มีบทความในหมวดนี้' : 'No posts in this category yet.'}
              </p>
            </div>
          ) : (
            <>
              {/* Featured post — the one emphasized card */}
              {featured && (
                <Link
                  href={`/post/${featured.slug}`}
                  className="card card-marked group mb-14 grid overflow-hidden md:grid-cols-2"
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
                    <span className="glass-tag absolute top-4 left-4 inline-flex rounded px-3 py-1 text-[10px] font-black tracking-[0.25em] text-brand-yellow uppercase">
                      {isThai ? 'บทความเด่น' : 'Featured'}
                    </span>
                  </div>
                  <div className="flex flex-col justify-between p-8 md:p-10">
                    <div>
                      {featured.category && typeof featured.category !== 'number' && (
                        <span className="t-label text-black/70">{featured.category.title}</span>
                      )}
                      <h2 className="t-h2 mt-3">{featured.title}</h2>
                      {featured.excerpt && (
                        <p className="mt-4 line-clamp-4 text-base leading-relaxed text-black/75">
                          {featured.excerpt}
                        </p>
                      )}
                    </div>
                    <div className="mt-8 flex items-center justify-between">
                      {featured.publishedAt && (
                        <span className="t-label text-black/70">{formatDate(featured.publishedAt)}</span>
                      )}
                      <span className="link-mark">
                        {isThai ? 'อ่านบทความ' : 'Read article'} →
                      </span>
                    </div>
                  </div>
                </Link>
              )}

              {/* Post grid */}
              {rest.length > 0 && (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {rest.map((post) => (
                    <Link
                      key={post.id}
                      href={`/post/${post.slug}`}
                      className="card group flex flex-col"
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
                      <div className="flex flex-1 flex-col p-6">
                        {post.category && typeof post.category !== 'number' && (
                          <span className="t-label text-black/70">{post.category.title}</span>
                        )}
                        <h3 className="t-h3 mt-2">{post.title}</h3>
                        {post.excerpt && (
                          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-black/75">
                            {post.excerpt}
                          </p>
                        )}
                        <div className="mt-auto flex items-center justify-between pt-6">
                          {post.publishedAt && (
                            <span className="t-label text-black/70">{formatDate(post.publishedAt)}</span>
                          )}
                          <span className="t-label border-b border-brand-yellow pb-0.5 text-black transition-colors group-hover:border-black">
                            {isThai ? 'อ่าน' : 'Read'} →
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </Container>
      </Section>

      {/* ---------------------------------------------------------------- CTA */}
      <CtaBand
        heading={isThai ? 'งานของเราขับเคลื่อนด้วยผู้สนับสนุน' : 'Our reporting is reader-funded.'}
        body={
          isThai
            ? 'การบริจาคของคุณช่วยให้ทีมภาคสนามของเราเดินทาง รายงาน และนำเรื่องราวของแรงงานไปสู่สาธารณะ'
            : 'Your support keeps our field team reporting and bringing worker voices into public view.'
        }
        actions={
          <>
            <ButtonLink href="/donate" variant="solidDark">
              {isThai ? 'บริจาค' : 'Donate'}
            </ButtonLink>
            <ButtonLink href="/contact" variant="ghostDark">
              {isThai ? 'ติดต่อทีมข่าว' : 'Contact newsroom'}
            </ButtonLink>
          </>
        }
      />
    </>
  )
}
