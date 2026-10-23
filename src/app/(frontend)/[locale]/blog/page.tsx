import { setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { getPosts, getCategories } from '@/lib/api'
import { HERO_IMAGES } from '@/lib/hero-images'
import { HeroBackdrop } from '@/components/HeroBackdrop'
import { MediaImage } from '@/components/MediaImage'
import { Container, Section, StatBand, ButtonLink, CtaBand, Eyebrow } from '@/components/ui'
import { tx, fmt } from '@/i18n/tx'
import { dateLocale, isDraftLocale } from '@/i18n/locales'

/** Posts per page — a glanceable grid (HIG: progressive disclosure), not all 64 at once. */
const PAGE_SIZE = 12

export default async function BlogIndex(props: {
  params: Promise<{ locale: Locale }>
  searchParams: Promise<{ category?: string; page?: string }>
}) {
  const { locale } = await props.params
  const { category, page: pageParam } = await props.searchParams
  setRequestLocale(locale)
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
    new Date(d).toLocaleDateString(dateLocale(locale), { year: 'numeric', month: 'short', day: 'numeric' })

  // my/km/lo list posts of every language; each card says which language it is written in.
  const draft = isDraftLocale(locale)
  const postLang = (language?: string | null) => (draft && language ? language : undefined)
  const langBadge = (language?: string | null) =>
    draft && language ? (
      <span className="inline-flex min-h-6 items-center rounded-full border border-black/25 px-2.5 text-[13px] font-semibold text-black/75">
        {language === 'th' ? tx(locale, 'ภาษาไทย', 'Thai') : tx(locale, 'ภาษาอังกฤษ', 'English')}
      </span>
    ) : null

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
        <HeroBackdrop src={HERO_IMAGES.news} alt="" />
        <div className="container-page relative z-10 py-16 md:py-20">
          <div className="max-w-3xl">
            <Eyebrow>{tx(locale, 'ข่าวสาร', 'News')}</Eyebrow>
            <h1 className="t-display-sm mt-6">
              {activeCategory
                ? activeCategory.title
                : tx(locale, 'รายงานจากแนวหน้า เรื่องเล่าของผู้รอด และเสียงจากแรงงาน', 'Frontline reports, survivor stories, and worker voices.')}
            </h1>
            <p className="t-lede mt-6 max-w-2xl text-white/85">
              {tx(locale, 'อ่านบทความ ข่าวสาร และผลงานวิจัยจากทีม LPN และเครือข่ายของเรา', 'Articles, press, and field updates from the LPN team and our network.')}
            </p>
          </div>

          <StatBand
            tone="dark"
            className="mt-12 max-w-2xl border-l-4 border-current pl-6"
            stats={[
              { value: String(totalDocs), label: tx(locale, 'บทความ', 'Posts') },
              { value: String(categories.length), label: tx(locale, 'หมวดหมู่', 'Categories') },
              { value: '2', label: tx(locale, 'ภาษา', 'Languages') },
            ]}
          />
        </div>
      </section>

      {/* --------------------------------------------------- CATEGORY FILTERS */}
      <div className="border-b border-black/15 bg-paper text-black on-light">
        <div className="container-page flex flex-wrap items-center gap-2 py-3">
          <span className="t-label mr-2 text-black/70">{tx(locale, 'กรองตาม', 'Filter')}</span>
          <Link
            href="/blog"
            aria-current={!category ? 'page' : undefined}
            className={`tactile-pill px-4 ${!category ? 'active' : ''}`}
          >
            {tx(locale, 'ทั้งหมด', 'All')}
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
                {tx(locale, 'ยังไม่มีบทความในหมวดนี้', 'No posts in this category yet.')}
              </p>
              <p className="mt-3 text-base text-black/70">
                {tx(locale, 'ลองดูบทความทั้งหมด หรือเลือกหมวดหมู่อื่น', 'Browse all posts or pick another category.')}
              </p>
              <ButtonLink href="/blog" variant="ghostDark" className="mt-6">
                {tx(locale, 'ดูบทความทั้งหมด', 'See all posts')}
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
                          {tx(locale, 'บทความเด่น', 'Featured')}
                        </span>
                        {featured.category && typeof featured.category !== 'number' && (
                          <span className="t-label text-black/70">{featured.category.title}</span>
                        )}
                        {langBadge(featured.language)}
                      </div>
                      <h2 className="t-h2 mt-4" lang={postLang(featured.language)}>{featured.title}</h2>
                      {featured.excerpt && (
                        <p className="mt-4 line-clamp-4 text-base leading-relaxed text-black/75" lang={postLang(featured.language)}>
                          {featured.excerpt}
                        </p>
                      )}
                    </div>
                    <div className="mt-8 flex items-center justify-between gap-4">
                      {featured.publishedAt && (
                        <span className="t-label text-black/70">{formatDate(featured.publishedAt)}</span>
                      )}
                      <span className="link-mark">
                        {tx(locale, 'อ่านบทความ', 'Read article')} →
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
                          <div className="flex flex-wrap items-center gap-2">
                            {post.category && typeof post.category !== 'number' && (
                              <span className="t-label text-black/70">{post.category.title}</span>
                            )}
                            {langBadge(post.language)}
                          </div>
                          <h3 className="t-h3 mt-2" lang={postLang(post.language)}>{post.title}</h3>
                          {post.excerpt && (
                            <p
                              lang={postLang(post.language)}
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
                              {tx(locale, 'อ่าน', 'Read')} →
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
                  aria-label={tx(locale, 'หน้าบทความ', 'Pagination')}
                  className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-black/15 pt-8"
                >
                  <p className="text-sm text-black/70">
                    {fmt(tx(locale, 'แสดง {first}–{last} จาก {total} บทความ · หน้า {page}/{pages}', 'Showing {first}–{last} of {total} posts · Page {page} of {pages}'), { first: firstIndex, last: lastIndex, total: totalDocs, page, pages: totalPages })}
                  </p>
                  <div className="flex gap-3">
                    <ButtonLink href={toHref(page - 1)} variant="ghostDark" disabled={!hasPrevPage}>
                      ← {tx(locale, 'ใหม่กว่า', 'Newer')}
                    </ButtonLink>
                    <ButtonLink href={toHref(page + 1)} variant="ghostDark" disabled={!hasNextPage}>
                      {tx(locale, 'เก่ากว่า', 'Older')} →
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
        heading={tx(locale, 'งานของเราขับเคลื่อนด้วยผู้สนับสนุน', 'Our reporting is reader-funded.')}
        body={
          tx(locale, 'การบริจาคของคุณช่วยให้ทีมภาคสนามของเราเดินทาง รายงาน และนำเรื่องราวของแรงงานไปสู่สาธารณะ', 'Your support keeps our field team reporting and bringing worker voices into public view.')
        }
        actions={
          <>
            <ButtonLink href="/donate" variant="solidDark">
              {tx(locale, 'บริจาค', 'Donate')}
            </ButtonLink>
            <ButtonLink href="/contact" variant="ghostDark">
              {tx(locale, 'ติดต่อเรา', 'Contact us')}
            </ButtonLink>
          </>
        }
      />
    </>
  )
}
