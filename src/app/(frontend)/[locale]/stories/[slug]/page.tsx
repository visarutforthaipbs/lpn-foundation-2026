import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { getStory } from '@/lib/api'
import { buildMetadata } from '@/lib/seo'
import { RichText } from '@/components/RichText'
import { MediaImage } from '@/components/MediaImage'
import { Container, Section } from '@/components/ui'

export async function generateMetadata(props: { params: Promise<{ locale: Locale; slug: string }> }) {
  const { locale, slug: raw } = await props.params
  const story = await getStory(decodeURIComponent(raw), locale)
  if (!story) return {}
  return buildMetadata({ locale, path: `/stories/${story.slug}`, title: story.title, description: story.summary })
}

export default async function StoryPage(props: { params: Promise<{ locale: Locale; slug: string }> }) {
  const { locale, slug: raw } = await props.params
  setRequestLocale(locale)
  const story = await getStory(decodeURIComponent(raw), locale)
  if (!story) notFound()
  const th = locale === 'th'
  return <>
    <Section tone="dark" tight><Container>
      <Link href="/stories" className="link-mark text-white">← {th ? 'กลับไปที่เรื่องราว' : 'Back to stories'}</Link>
      <h1 className="t-display mt-8 max-w-5xl text-white">{story.title}</h1>
      <p className="t-lede mt-6 max-w-3xl text-white/80">{story.summary}</p>
      {story.storyDate && <time dateTime={story.storyDate} className="t-label mt-6 block text-white/70">{new Date(story.storyDate).toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' })}</time>}
    </Container></Section>
    <Section tone="paper"><Container narrow>
      {story.coverImage && typeof story.coverImage === 'object' && <MediaImage media={story.coverImage} className="mb-10 w-full object-cover" sizes="(max-width:768px) 100vw, 900px" />}
      <RichText data={story.content} className="prose-lpn text-black/85" />
      <p className="mt-10 border-t border-black/15 pt-6 text-sm leading-relaxed text-black/70">{th
        ? 'เรื่องนี้เผยแพร่ตามขอบเขตความยินยอมและผ่านการตรวจสอบด้านความปลอดภัย รายละเอียดบางส่วนอาจถูกปรับเพื่อปกป้องผู้เกี่ยวข้อง'
        : 'This story was published within its consent scope after a safety review. Some details may be adapted to protect people involved.'}</p>
    </Container></Section>
  </>
}
