import { setRequestLocale } from 'next-intl/server'
import { dateLocale } from '@/i18n/locales'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { getStories } from '@/lib/api'
import { HERO_IMAGES } from '@/lib/hero-images'
import { HeroBackdrop } from '@/components/HeroBackdrop'
import { Reveal } from '@/components/motion'
import { buildMetadata } from '@/lib/seo'
import { ButtonLink, Container, Section, SectionHeading } from '@/components/ui'
import { tx } from '@/i18n/tx'

export async function generateMetadata(props: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await props.params
  return buildMetadata({
    locale, path: '/stories',
    title: tx(locale, 'เรื่องราว — LPN', 'Stories — LPN'),
    description: tx(locale, 'เรื่องราวที่ได้รับอนุญาตให้เผยแพร่และประวัติการทำงานของ LPN', 'Approved stories and the history of LPN’s work.'),
  })
}

export default async function StoriesPage(props: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await props.params
  setRequestLocale(locale)
  const stories = await getStories(locale)
  return <>
    <section className="relative isolate overflow-hidden bg-black text-white">
      <HeroBackdrop src={HERO_IMAGES.stories} alt="" />
      <Container className="relative z-10 py-16 md:py-24">
      <p className="eyebrow text-white/70">{tx(locale, 'เรื่องราว', 'Stories')}</p>
      <h1 className="t-display mt-6 max-w-5xl text-white">{tx(locale, 'ฟังเสียงผู้คนและมองเห็นการเปลี่ยนแปลง', 'People, choices, and change.')}</h1>
      <p className="t-lede mt-7 max-w-3xl text-white/80">{tx(locale, 'เราเผยแพร่เรื่องราวเมื่อได้รับความยินยอมและผ่านการตรวจสอบความปลอดภัย เพื่อให้เห็นบทบาทของคนทำงานและขอบเขตที่ LPN ช่วยเหลือ', 'We publish stories only after consent and a safety review, showing people’s own choices and the specific role LPN played.')}</p>
    </Container></section>
    <Section tone="paper"><Container>
      <SectionHeading eyebrow={tx(locale, 'เรื่องที่ได้รับอนุมัติ', 'Approved stories')} title={tx(locale, 'เรื่องราวจากงานภาคสนาม', 'Stories from the field')} />
      {stories.length ? <div className="mt-10 grid gap-5 md:grid-cols-2">{stories.map((story, si) => <Reveal key={story.id} delay={(si % 2) * 0.08}><Link href={`/stories/${story.slug}`} className="border-l-4 border-current bg-white p-7 transition-colors hover:bg-brand-yellow/10">
        {story.storyDate && <time dateTime={story.storyDate} className="t-label text-black/70">{new Date(story.storyDate).toLocaleDateString(dateLocale(locale), { year: 'numeric', month: 'short', day: 'numeric' })}</time>}
        <h3 className="t-h3 mt-3">{story.title}</h3>
        <p className="mt-4 text-sm leading-relaxed text-black/80">{story.summary}</p>
        <span className="link-mark mt-6 inline-block">{tx(locale, 'อ่านเรื่องราว', 'Read story')} →</span>
      </Link></Reveal>)}</div> : <p className="mt-8 max-w-3xl text-sm leading-relaxed text-black/75">{tx(locale, 'ยังไม่มีเรื่องราวรายบุคคลที่ผ่านการอนุมัติสำหรับเผยแพร่ในส่วนนี้ คุณสามารถอ่านข่าวและประวัติการทำงานของ LPN ได้ด้านล่าง', 'No individual stories have completed the approval process for this section yet. You can explore LPN’s published updates and history below.')}</p>}
    </Container></Section>
    <Section tone="light"><Container>
      <SectionHeading eyebrow={tx(locale, 'ประวัติการทำงาน', 'Our history')} title={tx(locale, 'เรื่องราวการช่วยเหลือในอดีต', 'Earlier rescue work')} lede={tx(locale, 'ปฏิบัติการช่วยเหลือแรงงานประมงที่ปรากฏในภาพยนตร์ Ghost Fleet เป็นส่วนสำคัญของประวัติ LPN แต่ไม่ใช่ภาพรวมทั้งหมดของงานในวันนี้', 'The fishing rescues documented in Ghost Fleet are an important part of LPN’s history, while today’s work extends far beyond them.')} />
      <div className="mt-8 flex flex-wrap gap-4"><ButtonLink href="/ghost-fleet" variant="solidDark">{tx(locale, 'อ่านเรื่อง Ghost Fleet', 'Explore Ghost Fleet')}</ButtonLink><ButtonLink href="/blog" variant="ghostDark">{tx(locale, 'อ่านข่าวทั้งหมด', 'Read all updates')}</ButtonLink></div>
    </Container></Section>
  </>
}
