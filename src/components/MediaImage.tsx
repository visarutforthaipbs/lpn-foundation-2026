import Image from 'next/image'
import type { Media } from '@/payload-types'

type MediaLike = Media | number | null | undefined

/** Renders a Payload media upload with next/image. No-ops when media is missing. */
export function MediaImage({
  media,
  className,
  sizes,
  priority,
}: {
  media: MediaLike
  className?: string
  sizes?: string
  priority?: boolean
}) {
  if (!media || typeof media === 'number' || !media.url) return null

  return (
    <Image
      src={media.url}
      alt={media.alt ?? ''}
      width={media.width ?? 1200}
      height={media.height ?? 800}
      className={className}
      sizes={sizes}
      priority={priority}
      {...(priority ? { fetchPriority: 'high' } as any : {})}
    />
  )
}
