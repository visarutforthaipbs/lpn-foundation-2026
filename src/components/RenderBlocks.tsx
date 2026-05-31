import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import type { Page } from '@/payload-types'
import { getTeam } from '@/lib/api'
import { MediaImage } from './MediaImage'
import { RichText } from './RichText'

type Block = NonNullable<Page['layout']>[number]

function CtaLink({ href, label }: { href?: string | null; label?: string | null }) {
  if (!href || !label) return null
  const isInternal = href.startsWith('/')
  const cls =
    'inline-block rounded-full bg-brand-yellow px-6 py-3 font-semibold text-black transition-all hover:bg-black hover:text-brand-yellow border border-transparent hover:border-brand-yellow'
  return isInternal ? (
    <Link href={href} className={cls}>
      {label}
    </Link>
  ) : (
    <a href={href} className={cls}>
      {label}
    </a>
  )
}

const Section = ({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) => <section className={`mx-auto max-w-6xl px-4 py-12 ${className}`}>{children}</section>

async function TeamGrid({
  block,
  locale,
}: {
  block: Extract<Block, { blockType: 'teamGrid' }>
  locale: Locale
}) {
  const team = await getTeam(locale)
  return (
    <Section>
      {block.heading && (
        <h2 className="mb-4 text-3xl font-black uppercase tracking-tight text-black">
          {block.heading}
        </h2>
      )}
      {block.intro && (
        <p className="mb-10 max-w-2xl text-black/75 leading-relaxed">{block.intro}</p>
      )}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {team.map((m) => (
          <div
            key={m.id}
            className="relative p-6 border border-black rounded bg-white overflow-hidden group"
          >
            <div className="absolute top-0 left-0 w-1.5 h-full bg-brand-yellow"></div>
            <div className="pl-4 flex flex-col items-center text-center">
              {m.photo && typeof m.photo !== 'number' ? (
                <div className="relative mb-4 p-1 border border-black rounded-full overflow-hidden bg-white">
                  <MediaImage
                    media={m.photo}
                    className="h-28 w-28 rounded-full object-cover transition-transform group-hover:scale-105 duration-300"
                  />
                </div>
              ) : (
                <div className="mb-4 w-28 h-28 rounded-full border border-black bg-brand-yellow/10 flex items-center justify-center font-bold text-black/25">
                  LPN
                </div>
              )}
              <div className="text-lg font-bold text-black uppercase tracking-tight">{m.name}</div>
              {m.role && (
                <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-black/60">
                  {m.role}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}

export async function RenderBlocks({
  blocks,
  locale,
}: {
  blocks?: Page['layout']
  locale: Locale
}) {
  if (!blocks?.length) return null

  return (
    <>
      {blocks.map((block, i) => {
        switch (block.blockType) {
          case 'hero':
            return (
              <section
                key={i}
                className="relative bg-black text-white min-h-[60vh] flex items-center py-20"
              >
                {block.image && typeof block.image !== 'number' ? (
                  <>
                    <div className="absolute inset-0 opacity-40">
                      <MediaImage
                        media={block.image}
                        className="h-full w-full object-cover"
                        priority
                        sizes="100vw"
                      />
                    </div>
                    <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-black/20" />
                  </>
                ) : null}
                <div className="relative mx-auto max-w-6xl px-4 w-full z-10">
                  <div className="max-w-3xl">
                    <span className="inline-flex rounded glass-tag px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-brand-yellow">
                      LPN Rebuild Project
                    </span>
                    <h1 className="mt-6 text-4xl font-black leading-none tracking-tight md:text-6xl text-balance">
                      {block.heading}
                    </h1>
                    {block.subheading && (
                      <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/90 md:text-lg">
                        {block.subheading}
                      </p>
                    )}
                    {block.ctaLabel && (
                      <div className="mt-8">
                        <CtaLink href={block.ctaHref} label={block.ctaLabel} />
                      </div>
                    )}
                  </div>
                </div>
              </section>
            )

          case 'stats':
            return (
              <Section key={i}>
                {block.heading && (
                  <h2 className="mb-8 text-center text-3xl font-bold text-black">
                    {block.heading}
                  </h2>
                )}
                <div className="grid gap-8 sm:grid-cols-3">
                  {block.items?.map((it, j) => (
                    <div
                      key={j}
                      className="relative p-6 border border-black rounded-2xl bg-white overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 w-2 h-full bg-brand-yellow"></div>
                      <div className="pl-4">
                        <div className="text-5xl font-black text-black">{it.value}</div>
                        <div className="mt-2 text-sm font-medium text-black">{it.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            )

          case 'richText':
            return (
              <Section key={i} className="max-w-3xl">
                <RichText data={block.content} />
              </Section>
            )

          case 'imageText':
            return (
              <Section key={i}>
                <div
                  className={`grid items-center gap-10 md:grid-cols-2 ${
                    block.imagePosition === 'right' ? 'md:[&>*:first-child]:order-2' : ''
                  }`}
                >
                  <div className="p-1 border border-black bg-white rounded overflow-hidden shadow-xs">
                    <MediaImage
                      media={block.image}
                      className="w-full rounded object-cover"
                      sizes="(max-width:768px) 100vw, 50vw"
                    />
                  </div>
                  <RichText data={block.content} />
                </div>
              </Section>
            )

          case 'cta':
            return (
              <section key={i} className="bg-black text-white border-y border-white/10">
                <div className="mx-auto max-w-6xl px-4 py-20 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
                  <div className="max-w-3xl relative pl-6 border-l-4 border-brand-yellow">
                    <h2 className="text-3xl font-black uppercase tracking-tight md:text-4xl">
                      {block.heading}
                    </h2>
                    {block.body && (
                      <p className="mt-4 text-base leading-relaxed text-white/80">{block.body}</p>
                    )}
                  </div>
                  {block.ctaLabel && (
                    <div className="shrink-0">
                      <CtaLink href={block.ctaHref} label={block.ctaLabel} />
                    </div>
                  )}
                </div>
              </section>
            )

          case 'teamGrid':
            return <TeamGrid key={i} block={block} locale={locale} />

          case 'contactInfo':
            return (
              <Section key={i} className="max-w-3xl">
                {block.heading && (
                  <h2 className="mb-4 text-3xl font-bold text-black">{block.heading}</h2>
                )}
                <RichText data={block.content} />
              </Section>
            )

          case 'donationDetails':
            return (
              <Section key={i} className="max-w-3xl">
                {block.heading && (
                  <h2 className="mb-4 text-3xl font-black uppercase tracking-tight text-black">
                    {block.heading}
                  </h2>
                )}
                <div className="relative p-8 border border-black rounded bg-white overflow-hidden">
                  <div className="absolute top-0 left-0 w-2 h-full bg-brand-yellow"></div>
                  <div className="pl-4">
                    <RichText data={block.content} />
                  </div>
                </div>
              </Section>
            )

          default:
            return null
        }
      })}
    </>
  )
}
