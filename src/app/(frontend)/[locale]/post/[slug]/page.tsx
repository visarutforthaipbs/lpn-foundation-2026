import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { routing, type Locale } from '@/i18n/routing'
import { getPost, getAllPostSlugs } from '@/lib/api'
import { MediaImage } from '@/components/MediaImage'
import { RichText } from '@/components/RichText'
import { buildMetadata, SITE_URL } from '@/lib/seo'

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
    <div className="bg-[#fafafa] min-h-screen py-10">
      <article className="mx-auto max-w-6xl px-4">
        {/* Breadcrumb / Back to Blog */}
        <div className="mb-6">
          <a
            href={`/${locale}/blog`}
            className="text-black/60 hover:text-black font-semibold text-sm inline-flex items-center gap-2 transition"
          >
            ← {locale === 'th' ? 'กลับไปที่บทความ' : 'Back to Voices & Stories'}
          </a>
        </div>

        {/* Post Hero Section */}
        <div className="relative overflow-hidden rounded-2xl bg-black text-white p-8 md:p-12 mb-8 shadow-xl">
          {/* Subtle brand yellow light glow in background */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-yellow/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col justify-end min-h-[180px]">
            {post.category && typeof post.category !== 'number' && (
              <span className="mb-4 inline-block w-fit rounded-full bg-brand-yellow px-4 py-1 text-xs font-black uppercase tracking-wider text-black">
                {post.category.title}
              </span>
            )}

            <h1 className="text-2xl md:text-4xl font-extrabold leading-tight tracking-tight text-white mb-6">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-white/70 border-t border-white/10 pt-6">
              {author && (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-brand-yellow text-black font-black flex items-center justify-center text-[10px]">
                    {author.name.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="font-bold text-white">{author.name}</span>
                </div>
              )}
              {author && post.publishedAt && <span className="text-white/30">·</span>}
              {post.publishedAt && (
                <time dateTime={post.publishedAt} className="font-semibold">
                  {new Date(post.publishedAt).toLocaleDateString(locale, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              )}
            </div>
          </div>
        </div>

        {/* Featured Image */}
        {post.coverImage && typeof post.coverImage !== 'number' ? (
          <div className="relative group overflow-hidden rounded-2xl shadow-md mb-10">
            <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition duration-300 z-10" />
            <MediaImage
              media={post.coverImage}
              className="w-full max-h-[480px] object-cover transition-transform duration-700 group-hover:scale-[1.01]"
              sizes="(max-width:768px) 100vw, 1200px"
              priority
            />
          </div>
        ) : null}

        {/* Article Body + Sidebar Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main content column */}
          <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-2xl border border-black/5 shadow-xs">
            <RichText data={post.content} className="prose-lpn text-lg text-black/85" />

            {/* Action Divider */}
            <div className="border-t border-black/10 mt-10 pt-6 flex items-center justify-between">
              <span className="text-xs font-black text-black/40 uppercase tracking-widest">
                {locale === 'th' ? 'แชร์บทความนี้' : 'Share this Story'}
              </span>
              <div className="flex gap-2">
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${SITE_URL}/post/${slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-black/5 hover:bg-brand-yellow hover:text-black flex items-center justify-center text-xs font-bold text-black transition"
                >
                  FB
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?url=${SITE_URL}/post/${slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-black/5 hover:bg-brand-yellow hover:text-black flex items-center justify-center text-xs font-bold text-black transition"
                >
                  X
                </a>
              </div>
            </div>
          </div>

          {/* Sidebar - LPN Action Cards */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-black text-white p-6 rounded-2xl shadow-lg relative overflow-hidden border border-white/10">
              {/* Subtle accent glow */}
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-brand-yellow/20 rounded-full blur-2xl pointer-events-none" />

              <span className="text-[9px] font-black uppercase tracking-widest text-brand-yellow bg-brand-yellow/10 px-2.5 py-1 rounded-full border border-brand-yellow/20 mb-4 inline-block">
                {locale === 'th' ? 'ยืนหยัดร่วมกับ LPN' : 'Stand With Us'}
              </span>

              <h3 className="text-lg font-bold mb-3 leading-snug">
                {locale === 'th'
                  ? 'ร่วมยุติการค้ามนุษย์และคุ้มครองสิทธิ์แรงงาน'
                  : 'End Human Trafficking & Protect Workers'}
              </h3>

              <p className="text-xs text-white/70 leading-relaxed mb-6">
                {locale === 'th'
                  ? 'มูลนิธิ LPN ดำเนินงานเพื่อช่วยเหลือแรงงานที่ถูกบังคับ ยุติการค้าทาสสมัยใหม่ และสร้างความมั่นใจในสิทธิความเป็นมนุษย์ที่เท่าเทียม'
                  : 'LPN Foundation works tirelessly to rescue abused workers, combat modern slavery, and secure justice for migrant communities.'}
              </p>

              <a
                href={`/${locale}/donate`}
                className="block w-full text-center bg-brand-yellow text-black font-black py-3 px-4 rounded-xl hover:bg-white transition duration-300 text-xs uppercase tracking-wider"
              >
                {locale === 'th' ? 'ร่วมบริจาคสนับสนุน' : 'Support Our Mission'}
              </a>
            </div>

            {/* LPN Contact Info Sidebar Card */}
            <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-xs">
              <h4 className="text-xs font-black uppercase tracking-widest text-black mb-3">
                {locale === 'th' ? 'ต้องการความช่วยเหลือ?' : 'Need Assistance?'}
              </h4>
              <p className="text-xs text-black/60 leading-relaxed mb-4">
                {locale === 'th'
                  ? 'สายด่วนมูลนิธิ LPN พร้อมให้คำปรึกษาและเข้าช่วยเหลือแรงงานหลากหลายภาษาตลอด 24 ชั่วโมง'
                  : 'LPN operates multi-lingual 24/7 hotlines to support workers and report labor abuses.'}
              </p>
              <div className="flex flex-col gap-2">
                <a
                  href="tel:+66841211609"
                  className="text-xs font-bold text-black hover:text-brand-yellow flex justify-between items-center bg-[#fafafa] p-2.5 rounded-lg border border-black/5 hover:border-brand-yellow/30 transition"
                >
                  <span>🇹🇭 Thai</span>
                  <span className="text-black/60">+66 84 121 1609</span>
                </a>
                <a
                  href="tel:+66855341595"
                  className="text-xs font-bold text-black hover:text-brand-yellow flex justify-between items-center bg-[#fafafa] p-2.5 rounded-lg border border-black/5 hover:border-brand-yellow/30 transition"
                >
                  <span>🇰🇭 Khmer</span>
                  <span className="text-black/60">+66 85 534 1595</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  )
}
