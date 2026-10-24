import type { TeamMember } from '@/payload-types'
import { MediaImage } from '@/components/MediaImage'
import { Reveal } from '@/components/motion'

/**
 * Portrait card for a team member. The staff portraits are shot on the brand yellow (#FFC314) at 3:4, so the photo
 * is the card's top block and the yellow IS the frame — no circle crop, no extra fill. Missing photo → the designed
 * fallback (yellow block with the LPN mark), never a grey box.
 */
export function TeamCard({ member, index = 0, sizes = '(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw' }: { member: TeamMember; index?: number; sizes?: string }) {
  const photo = member.photo && typeof member.photo !== 'number' ? member.photo : null
  return (
    <Reveal as="article" delay={(index % 4) * 0.07} className="flex flex-col overflow-hidden rounded-xl border border-black/10 bg-white dark:border-white/15 dark:bg-black">
      <div className="relative aspect-[3/4] w-full bg-brand-yellow">
        {photo ? (
          <MediaImage media={photo} fill sizes={sizes} className="object-cover object-top" alt={member.name} />
        ) : (
          <div className="flex h-full w-full items-end p-4 text-xs font-semibold text-black/60">LPN</div>
        )}
      </div>
      <div className="p-4">
        <h3 className="t-h3">{member.name}</h3>
        {member.role && <div className="t-label mt-1 text-black/60 dark:text-white/60">{member.role}</div>}
      </div>
    </Reveal>
  )
}
