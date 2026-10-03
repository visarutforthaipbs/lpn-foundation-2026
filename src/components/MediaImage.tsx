import Image from 'next/image'
import type { Media } from '@/payload-types'

type MediaLike = Media | number | null | undefined

/** Renders a Payload media upload with next/image. No-ops when media is missing. */
export function MediaImage({
  media,
  className,
  sizes,
  priority,
  alt,
  fill,
}: {
  media: MediaLike
  className?: string
  sizes?: string
  priority?: boolean
  alt?: string
  fill?: boolean
}) {
  if (!media || typeof media === 'number' || !media.url) return null

  const resolvedAlt = alt !== undefined ? alt : (media.alt ?? '')

  if (fill) {
    return (
      <Image
        src={media.url}
        alt={resolvedAlt}
        fill
        className={className}
        sizes={sizes}
        priority={priority}
      />
    )
  }

  return (
    <Image
      src={media.url}
      alt={resolvedAlt}
      width={media.width ?? 1200}
      height={media.height ?? 800}
      className={className}
      sizes={sizes}
      priority={priority}
    />
  )
}
