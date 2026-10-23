import Image from 'next/image'

/**
 * Photo behind a dark hero. The photo stays clearly visible on the right; a left-to-right gradient keeps the
 * headline on the left at full contrast (white on ≥ 85 % black). One treatment for every page hero.
 */
export function HeroBackdrop({ src, alt = '', position = 'center' }: { src: string; alt?: string; position?: string }) {
  return (
    <div className="absolute inset-0 z-0">
      <Image src={src} alt={alt} fill priority sizes="100vw" className="object-cover opacity-70" style={{ objectPosition: position }} />
      <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-black via-black/75 to-black/10" />
      <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
    </div>
  )
}
