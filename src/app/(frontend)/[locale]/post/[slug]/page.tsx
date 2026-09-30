import { notFound, permanentRedirect } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { getPost, getAllPostSlugs } from '@/lib/api'
import { HOTLINES, OFFICE, telHref, buildShareUrls } from '@/lib/content'
import { MediaImage } from '@/components/MediaImage'
import { RichText } from '@/components/RichText'
import { buildMetadata } from '@/lib/seo'
import { legacyPostDestination } from '@/lib/legacy-posts'
import { ButtonLink, MarkLink } from '@/components/ui'

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
  if (!post) {
    const destination = legacyPostDestination(slug, locale)
    if (destination) permanentRedirect(destination)
    notFound()
  }

  const isThai = locale === 'th'
  const author = post.author && typeof post.author !== 'number' ? post.author : null
  const share = buildShareUrls(locale, slug)
  // Sidebar offers the Thai + Khmer lines first (highest call volume).
  const sidebarHotlines = HOTLINES.filter((h) => h.code === 'TH' || h.code === 'KH')

  return (
    <div className="bg-paper py-10 on-light">
      <article className="container-page">
        {/* Breadcrumb */}
        <nav aria-label={isThai ? 'เส้นทางนำทาง' : 'Breadcrumb'} className="mb-8">
          <Link
            href="/blog"
            className="t-label inline-flex min-h-11 items-center gap-2 text-black/70 transition-colors hover:text-black"
          >
            ← {isThai ? 'กลับไปที่บทความ' : 'Back to Voices & Stories'}
          </Link>
        </nav>

        {/* Post header */}
        <header className="relative isolate overflow-hidden rounded bg-black p-8 text-white md:p-12">
          <div
            className="pointer-events-none absolute top-0 right-0 h-96 w-96 rounded-full bg-brand-yellow/10 blur-3xl"
            aria-hidden="true"
          />
          <div className="relative z-10 flex min-h-[180px] flex-col justify-end">
            {post.category && typeof post.category !== 'number' && (
              <span className="mb-5 inline-flex w-fit rounded-full bg-brand-yellow px-4 py-1.5 text-xs font-black tracking-wider text-black uppercase">
                {post.category.title}
              </span>
            )}
            <h1 className="t-display-sm text-white">{post.title}</h1>
            <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-white/10 pt-6">
              {author && (
                <div className="flex items-center gap-2.5">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-yellow text-[10px] font-black text-black"
                    aria-hidden="true"
                  >
                    {author.name.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="text-sm font-bold text-white">{author.name}</span>
                </div>
              )}
              {author && post.publishedAt && <span className="text-white/30">·</span>}
              {post.publishedAt && (
                <time dateTime={post.publishedAt} className="text-sm font-semibold text-white/80">
                  {new Date(post.publishedAt).toLocaleDateString(locale, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              )}
            </div>
          </div>
        </header>

        {/* Featured image */}
        {post.coverImage && typeof post.coverImage !== 'number' ? (
          <div className="group relative my-10 overflow-hidden rounded shadow-md">
            <div
              className="absolute inset-0 z-10 bg-black/5 transition duration-300 group-hover:bg-transparent"
              aria-hidden="true"
            />
            <MediaImage
              media={post.coverImage}
              className="max-h-[480px] w-full object-cover transition-transform duration-700 group-hover:scale-[1.01]"
              sizes="(max-width:768px) 100vw, 1200px"
              priority
            />
          </div>
        ) : null}

        {/* Body + action sidebar */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Article body */}
          <div className="rounded border border-black/8 bg-white p-6 shadow-xs lg:col-span-8 md:p-10">
            <RichText data={post.content} className="prose-lpn text-black/85" />

            {/* Share row */}
            <div className="mt-12 flex items-center justify-between border-t border-black/10 pt-6">
              <span className="t-label text-black/70">
                {isThai ? 'แชร์บทความนี้' : 'Share this Story'}
              </span>
              <div className="flex gap-2">
                <a
                  href={share.facebook}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Share on Facebook"
                  className="tactile-icon-btn-light h-11 w-11 text-xs font-black"
                >
                  FB
                </a>
                <a
                  href={share.x}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Share on X"
                  className="tactile-icon-btn-light h-11 w-11 text-xs font-black"
                >
                  X
                </a>
              </div>
            </div>
          </div>

          {/* LPN action sidebar */}
          <aside className="flex flex-col gap-6 lg:col-span-4">
            {/* Donation CTA */}
            <div className="glass-dark relative overflow-hidden rounded p-7">
              <span className="absolute top-0 left-0 h-1.5 w-12 bg-brand-yellow" aria-hidden="true" />
              <span className="t-label text-brand-yellow">
                {isThai ? 'ยืนหยัดร่วมกับ LPN' : 'Stand With Us'}
              </span>
              <h2 className="t-h3 mt-4">
                {isThai
                  ? 'ร่วมยุติการค้ามนุษย์และคุ้มครองสิทธิ์แรงงาน'
                  : 'End Human Trafficking & Protect Workers'}
              </h2>
              <p className="mt-4 text-xs leading-relaxed text-white/70">
                {isThai
                  ? 'มูลนิธิ LPN ดำเนินงานเพื่อช่วยเหลือแรงงานที่ถูกบังคับ ยุติการค้าทาสสมัยใหม่ และสร้างความมั่นใจในสิทธิความเป็นมนุษย์ที่เท่าเทียม'
                  : 'LPN Foundation works tirelessly to rescue abused workers, combat modern slavery, and secure justice for migrant communities.'}
              </p>
              <ButtonLink href="/donate" variant="primary" className="mt-6 w-full">
                {isThai ? 'ร่วมบริจาคสนับสนุน' : 'Support Our Mission'}
              </ButtonLink>
            </div>

            {/* Hotline card */}
            <div className="card p-7">
              <h2 className="t-label text-black">{isThai ? 'ต้องการความช่วยเหลือ?' : 'Need Assistance?'}</h2>
              <p className="mt-3 text-xs leading-relaxed text-black/60">
                {isThai
                  ? 'ติดต่อ LPN ผ่านหมายเลขตามภาษาที่ต้องการ หากโทรไม่ติด สามารถดูช่องทางอื่นได้ในหน้าขอความช่วยเหลือ'
                  : 'Contact LPN using the number for your language. If a call does not connect, find other channels on Get Help.'}
              </p>
              <div className="mt-5 flex flex-col gap-2.5">
                {sidebarHotlines.map((h) => (
                  <a
                    key={h.code}
                    href={telHref(h.phone)}
                    className="tactile-well flex min-h-11 items-center justify-between p-3 text-xs font-bold text-black transition-transform hover:-translate-y-0.5"
                  >
                    <span className="flex items-center gap-2">
                      <span className="tactile-badge h-6 w-6 text-[10px] font-black text-black">
                        {h.code}
                      </span>
                      <span>{isThai ? h.langTh : h.langEn}</span>
                    </span>
                    <span className="font-mono text-xs font-bold text-black">{h.phone}</span>
                  </a>
                ))}
              </div>
              <MarkLink href="/contact" className="mt-5 text-black">
                {isThai ? 'ดูช่องทางช่วยเหลือทั้งหมด' : 'All support channels'} →
              </MarkLink>
            </div>

            {/* Email */}
            <div className="px-1">
              <a
                href={`mailto:${OFFICE.email}`}
                className="t-label inline-flex min-h-11 items-center text-black/70 transition-colors hover:text-black"
              >
                {OFFICE.email} →
              </a>
            </div>
          </aside>
        </div>
      </article>
    </div>
  )
}
