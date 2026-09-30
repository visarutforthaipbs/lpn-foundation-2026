import type { Locale } from '@/i18n/routing'
import type { Page } from '@/payload-types'
import { getTeam } from '@/lib/api'
import { MediaImage } from './MediaImage'
import { RichText } from './RichText'
import { Container, Section, SectionHeading, StatBand, ButtonLink, Eyebrow } from './ui'

type Block = NonNullable<Page['layout']>[number]

function CtaLink({ href, label }: { href?: string | null; label?: string | null }) {
  if (!href || !label) return null
  return (
    <ButtonLink href={href} variant="primary">
      {label}
    </ButtonLink>
  )
}

async function TeamGrid({
  block,
  locale,
}: {
  block: Extract<Block, { blockType: 'teamGrid' }>
  locale: Locale
}) {
  const team = await getTeam(locale)
  return (
    <Section tone="dark">
      <Container>
        <SectionHeading
          tone="light"
          title={block.heading ?? ''}
          lede={block.intro ?? undefined}
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((m) => (
            <article key={m.id} className="glass-dark group rounded p-7">
              <div className="flex flex-col items-center text-center">
                {m.photo && typeof m.photo !== 'number' ? (
                  <div className="mb-5 overflow-hidden rounded-full border border-white/20 p-1">
                    <MediaImage
                      media={m.photo}
                      className="h-28 w-28 rounded-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="mb-5 flex h-28 w-28 items-center justify-center rounded-full border border-white/20 bg-brand-yellow/10 text-sm font-black text-brand-yellow">
                    LPN
                  </div>
                )}
                <h3 className="t-h3 text-white">{m.name}</h3>
                {m.role && <div className="t-label mt-1.5 text-white/55">{m.role}</div>}
              </div>
            </article>
          ))}
        </div>
      </Container>
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
        if (block.blockName === 'Wix source archive') return null
        switch (block.blockType) {
          case 'hero':
            return (
              <section key={i} className="relative isolate overflow-hidden bg-black text-white">
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
                    <div className="absolute inset-0 bg-linear-to-t from-black via-black/60 to-black/25" />
                  </>
                ) : null}
                <div className="container-page relative z-10 flex min-h-[55vh] items-center py-20">
                  <div className="max-w-3xl">
                    <Eyebrow>LPN Foundation</Eyebrow>
                    <h1 className="t-display mt-6">{block.heading}</h1>
                    {block.subheading && (
                      <p className="t-lede mt-6 max-w-2xl text-white/90">{block.subheading}</p>
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
              <Section key={i} tone="yellow" tight className="border-y border-black on-light">
                <Container>
                  {block.heading && (
                    <h2 className="t-h2 mb-10 text-center">{block.heading}</h2>
                  )}
                  <StatBand
                    tone="yellow"
                    stats={(block.items ?? []).map((it) => ({ value: it.value, label: it.label }))}
                  />
                </Container>
              </Section>
            )

          case 'richText':
            return (
              <Section key={i} tone="light" className="on-light">
                <Container narrow>
                  <RichText data={block.content} />
                </Container>
              </Section>
            )

          case 'imageText':
            return (
              <Section key={i} tone="paper" className="on-light">
                <Container>
                  <div
                    className={`grid items-center gap-12 md:grid-cols-2 ${
                      block.imagePosition === 'right' ? 'md:[&>*:first-child]:order-2' : ''
                    }`}
                  >
                    <div className="overflow-hidden rounded border border-black/10 bg-white p-1 shadow-xs">
                      <MediaImage
                        media={block.image}
                        className="w-full rounded object-cover"
                        sizes="(max-width:768px) 100vw, 50vw"
                      />
                    </div>
                    <RichText data={block.content} />
                  </div>
                </Container>
              </Section>
            )

          case 'cta':
            return (
              <Section key={i} tone="yellow" tight className="border-y border-black on-light">
                <Container>
                  <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                    <div className="max-w-3xl">
                      <h2 className="t-h2">{block.heading}</h2>
                      {block.body && (
                        <p className="mt-4 text-base leading-relaxed text-black/75">{block.body}</p>
                      )}
                    </div>
                    {block.ctaLabel && (
                      <div className="shrink-0">
                        <CtaLink href={block.ctaHref} label={block.ctaLabel} />
                      </div>
                    )}
                  </div>
                </Container>
              </Section>
            )

          case 'teamGrid':
            return <TeamGrid key={i} block={block} locale={locale} />

          case 'contactInfo':
            return (
              <Section key={i} tone="light" className="on-light">
                <Container narrow>
                  {block.heading && <h2 className="t-h2 mb-6">{block.heading}</h2>}
                  <RichText data={block.content} />
                </Container>
              </Section>
            )

          case 'donationDetails':
            return (
              <Section key={i} tone="light" className="on-light">
                <Container>
                  {block.heading && <h2 className="t-h2 mb-8">{block.heading}</h2>}
                  <div className="card card-marked p-8 md:p-10">
                    <RichText data={block.content} />
                  </div>
                </Container>
              </Section>
            )

          default:
            return null
        }
      })}
    </>
  )
}
