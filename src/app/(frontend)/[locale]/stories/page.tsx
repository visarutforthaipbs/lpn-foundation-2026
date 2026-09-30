import { setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { getStories } from '@/lib/api'
import { buildMetadata } from '@/lib/seo'
import { ButtonLink, Container, Section, SectionHeading } from '@/components/ui'

export async function generateMetadata(props: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await props.params
  return buildMetadata({
    locale, path: '/stories',
    title: locale === 'th' ? 'เรื่องราว — LPN' : 'Stories — LPN',
    description: locale === 'th'
      ? 'เรื่องราวที่ได้รับอนุญาตให้เผยแพร่และประวัติการทำงานของ LPN'
      : 'Approved stories and the history of LPN’s work.',
  })
}

export default async function StoriesPage(props: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await props.params
  setRequestLocale(locale)
  const th = locale === 'th'
  const stories = await getStories(locale)
  return <>
    <Section tone="dark"><Container>
      <p className="eyebrow text-brand-yellow">{th ? 'เรื่องราว' : 'Stories'}</p>
      <h1 className="t-display mt-6 max-w-5xl text-white">{th ? 'ฟังเสียงผู้คนและมองเห็นการเปลี่ยนแปลง' : 'People, choices, and change.'}</h1>
      <p className="t-lede mt-7 max-w-3xl text-white/80">{th
        ? 'เราเผยแพร่เรื่องราวเมื่อได้รับความยินยอมและผ่านการตรวจสอบความปลอดภัย เพื่อให้เห็นบทบาทของคนทำงานและขอบเขตที่ LPN ช่วยเหลือ'
        : 'We publish stories only after consent and a safety review, showing people’s own choices and the specific role LPN played.'}</p>
    </Container></Section>
    <Section tone="paper"><Container>
      <SectionHeading eyebrow={th ? 'เรื่องที่ได้รับอนุมัติ' : 'Approved stories'} title={th ? 'เรื่องราวจากงานภาคสนาม' : 'Stories from the field'} />
      {stories.length ? <div className="mt-10 grid gap-5 md:grid-cols-2">{stories.map((story) => <Link href={`/stories/${story.slug}`} key={story.id} className="border-l-4 border-brand-yellow bg-white p-7 transition-colors hover:bg-brand-yellow/10">
        {story.storyDate && <time dateTime={story.storyDate} className="t-label text-black/70">{new Date(story.storyDate).toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' })}</time>}
        <h3 className="t-h3 mt-3">{story.title}</h3>
        <p className="mt-4 text-sm leading-relaxed text-black/80">{story.summary}</p>
        <span className="link-mark mt-6 inline-block">{th ? 'อ่านเรื่องราว' : 'Read story'} →</span>
      </Link>)}</div> : <p className="mt-8 max-w-3xl text-sm leading-relaxed text-black/75">{th
        ? 'ยังไม่มีเรื่องราวรายบุคคลที่ผ่านการอนุมัติสำหรับเผยแพร่ในส่วนนี้ คุณสามารถอ่านข่าวและประวัติการทำงานของ LPN ได้ด้านล่าง'
        : 'No individual stories have completed the approval process for this section yet. You can explore LPN’s published updates and history below.'}</p>}
    </Container></Section>
    <Section tone="light"><Container>
      <SectionHeading eyebrow={th ? 'ประวัติการทำงาน' : 'Our history'} title={th ? 'เรื่องราวการช่วยเหลือในอดีต' : 'Earlier rescue work'} lede={th
        ? 'ปฏิบัติการช่วยเหลือแรงงานประมงที่ปรากฏในภาพยนตร์ Ghost Fleet เป็นส่วนสำคัญของประวัติ LPN แต่ไม่ใช่ภาพรวมทั้งหมดของงานในวันนี้'
        : 'The fishing rescues documented in Ghost Fleet are an important part of LPN’s history, while today’s work extends far beyond them.'} />
      <div className="mt-8 flex flex-wrap gap-4"><ButtonLink href="/ghost-fleet" variant="solidDark">{th ? 'อ่านเรื่อง Ghost Fleet' : 'Explore Ghost Fleet'}</ButtonLink><ButtonLink href="/blog" variant="ghostDark">{th ? 'อ่านข่าวทั้งหมด' : 'Read all updates'}</ButtonLink></div>
    </Container></Section>
  </>
}
