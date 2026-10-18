import { setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { getPosts, getCategories } from '@/lib/api'
import { MediaImage } from '@/components/MediaImage'
import { Container, Section, StatBand, ButtonLink, CtaBand, Eyebrow } from '@/components/ui'

/** Posts per page — a glanceable grid (HIG: progressive disclosure), not all 64 at once. */
const PAGE_SIZE = 12

export default async function BlogIndex(props: {
  params: Promise<{ locale: Locale }>
  searchParams: Promise<{ category?: string; page?: string }>
}) {
  const { locale } = await props.params
  const { category, page: pageParam } = await props.searchParams
  setRequestLocale(locale)
  const isThai = locale === 'th'
  const page = Math.max(1, Number.parseInt(pageParam ?? '1', 10) || 1)

  const [result, categories] = await Promise.all([
    getPosts(locale, { categorySlug: category, limit: PAGE_SIZE, page }),
    getCategories(locale),
  ])
  const { docs: posts, totalDocs, totalPages, hasNextPage, hasPrevPage } = result

  const activeCategory = category ? categories.find((c) => c.slug === category) : null
  // The featured slot only exists on the first page.
  const featured = page === 1 ? posts[0] : undefined
  const rest = page === 1 ? posts.slice(1) : posts

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' })

  const pageQuery = (n: number) => ({
    ...(category ? { category } : {}),
    ...(n > 1 ? { page: String(n) } : {}),
  })
  const toHref = (n: number) => {
    const q = new URLSearchParams(pageQuery(n)).toString()
    return q ? `/blog?${q}` : '/blog'
  }

  const firstIndex = (page - 1) * PAGE_SIZE + 1
  const lastIndex = Math.min(page * PAGE_SIZE, totalDocs)

  return (
    <>
      {/* ------------------------------------------------------- COMPACT HERO */}
      <section className="relative isolate overflow-hidden bg-black text-white">
        <div className="container-page relative z-10 py-16 md:py-20">
          <div className="max-w-3xl">
            <Eyebrow>{isThai ? 'ข่าวสาร' : 'News'}</Eyebrow>
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
            className="mt-12 max-w-2xl border-l-4 border-current pl-6"
            stats={[
              { value: String(totalDocs), label: isThai ? 'บทความ' : 'Posts' },
              { value: String(categories.length), label: isThai ? 'หมวดหมู่' : 'Categories' },
              { value: '2', label: isThai ? 'ภาษา' : 'Languages' },
            ]}
          />
        </div>
      </section>

      {/* --------------------------------------------------- CATEGORY FILTERS */}
      <div className="border-b border-black/15 bg-paper text-black on-light">
        <div className="container-page flex flex-wrap items-center gap-2 py-3">
          <span className="t-label mr-2 text-black/70">{isThai ? 'กรองตาม' : 'Filter'}</span>
          <Link
            href="/blog"
            aria-current={!category ? 'page' : undefined}
            className={`tactile-pill px-4 ${!category ? 'active' : ''}`}
          >
            {isThai ? 'ทั้งหมด' : 'All'}
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              href={{ pathname: '/blog', query: { category: c.slug } }}
              aria-current={category === c.slug ? 'page' : undefined}
              className={`tactile-pill px-4 ${category === c.slug ? 'active' : ''}`}
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
            <div className="rounded-xl border border-black/15 bg-paper p-12 text-center">
              <p className="t-h3">
                {isThai ? 'ยังไม่มีบทความในหมวดนี้' : 'No posts in this category yet.'}
              </p>
              <p className="mt-3 text-base text-black/70">
                {isThai ? 'ลองดูบทความทั้งหมด หรือเลือกหมวดหมู่อื่น' : 'Browse all posts or pick another category.'}
              </p>
              <ButtonLink href="/blog" variant="ghostDark" className="mt-6">
                {isThai ? 'ดูบทความทั้งหมด' : 'See all posts'}
              </ButtonLink>
            </div>
          ) : (
            <>
              {/* Featured post — the one emphasised card (first page only) */}
              {featured && (
                <Link
                  href={`/post/${featured.slug}`}
                  className={`card card-marked group mb-14 grid overflow-hidden ${
                    featured.coverImage && typeof featured.coverImage !== 'number' ? 'md:grid-cols-2' : ''
                  }`}
                >
                  {featured.coverImage && typeof featured.coverImage !== 'number' && (
                    <div className="relative aspect-4/3 overflow-hidden bg-black md:aspect-auto">
                      <MediaImage
                        media={featured.coverImage}
                        className="h-full w-full object-cover"
                        sizes="(max-width:768px) 100vw, 50vw"
                        priority
                      />
                    </div>
                  )}
                  <div className="flex flex-col justify-between p-8 md:p-10">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="glass-tag inline-flex px-3 py-1">
                          {isThai ? 'บทความเด่น' : 'Featured'}
                        </span>
                        {featured.category && typeof featured.category !== 'number' && (
                          <span className="t-label text-black/70">{featured.category.title}</span>
                        )}
                      </div>
                      <h2 className="t-h2 mt-4">{featured.title}</h2>
                      {featured.excerpt && (
                        <p className="mt-4 line-clamp-4 text-base leading-relaxed text-black/75">
                          {featured.excerpt}
                        </p>
                      )}
                    </div>
                    <div className="mt-8 flex items-center justify-between gap-4">
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

              {/* Post grid — cards without a cover render as text cards, never a grey box. */}
              {rest.length > 0 && (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {rest.map((post) => {
                    const cover = post.coverImage && typeof post.coverImage !== 'number' ? post.coverImage : null
                    return (
                      <Link
                        key={post.id}
                        href={`/post/${post.slug}`}
                        className={`card group flex flex-col ${cover ? '' : 'bg-paper'}`}
                      >
                        {cover && (
                          <div className="relative aspect-video overflow-hidden">
                            <MediaImage
                              media={cover}
                              className="h-full w-full object-cover"
                              sizes="(max-width:1024px) 100vw, 33vw"
                            />
                          </div>
                        )}
                        <div className="flex flex-1 flex-col p-6">
                          {post.category && typeof post.category !== 'number' && (
                            <span className="t-label text-black/70">{post.category.title}</span>
                          )}
                          <h3 className="t-h3 mt-2">{post.title}</h3>
                          {post.excerpt && (
                            <p
                              className={`mt-3 leading-relaxed text-black/75 ${
                                cover ? 'line-clamp-3 text-sm' : 'line-clamp-5 text-base'
                              }`}
                            >
                              {post.excerpt}
                            </p>
                          )}
                          <div className="mt-auto flex items-center justify-between pt-6">
                            {post.publishedAt && (
                              <span className="t-label text-black/70">{formatDate(post.publishedAt)}</span>
                            )}
                            <span className="t-label-lg border-b-2 border-brand-yellow pb-0.5 text-black transition-colors group-hover:border-current">
                              {isThai ? 'อ่าน' : 'Read'} →
                            </span>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <nav
                  aria-label={isThai ? 'หน้าบทความ' : 'Pagination'}
                  className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-black/15 pt-8"
                >
                  <p className="text-sm text-black/70">
                    {isThai
                      ? `แสดง ${firstIndex}–${lastIndex} จาก ${totalDocs} บทความ · หน้า ${page}/${totalPages}`
                      : `Showing ${firstIndex}–${lastIndex} of ${totalDocs} posts · Page ${page} of ${totalPages}`}
                  </p>
                  <div className="flex gap-3">
                    <ButtonLink href={toHref(page - 1)} variant="ghostDark" disabled={!hasPrevPage}>
                      ← {isThai ? 'ใหม่กว่า' : 'Newer'}
                    </ButtonLink>
                    <ButtonLink href={toHref(page + 1)} variant="ghostDark" disabled={!hasNextPage}>
                      {isThai ? 'เก่ากว่า' : 'Older'} →
                    </ButtonLink>
                  </div>
                </nav>
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
              {isThai ? 'ติดต่อเรา' : 'Contact us'}
            </ButtonLink>
          </>
        }
      />
    </>
  )
}
