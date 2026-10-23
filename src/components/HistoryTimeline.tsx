import { FilmSlate, FlagBanner, HandHeart, Lifebuoy, Medal, Scales } from '@phosphor-icons/react/ssr'
import type { Icon } from '@phosphor-icons/react'
import { Reveal, DrawLine, CountUp } from '@/components/motion'

export type Milestone = {
  /** first year (CE) — positions the mark on the axis */
  from: number
  /** last year (CE) for a period, e.g. 2014–2016; omit for a single moment */
  to?: number
  /** label shown to readers, e.g. '2557–2559 (2014–2016)' */
  label: string
  title: string
  body: string
  kind: 'founding' | 'law' | 'rescue' | 'recognition' | 'film' | 'today'
}

const ICONS: Record<Milestone['kind'], Icon> = {
  founding: FlagBanner,
  law: Scales,
  rescue: Lifebuoy,
  recognition: Medal,
  film: FilmSlate,
  today: HandHeart,
}

/**
 * Proportional timeline (dark section). Desktop: a true time axis — every milestone sits at its real year, a period
 * is drawn as a band, cards alternate above/below the axis. Mobile: the same data as a vertical rail. Monochrome
 * marks on purpose (brand: yellow is reserved for the one action / selection / focus).
 */
export function HistoryTimeline({ items, start, end, stats, todayLabel, yearOffset = 0 }: {
  items: Milestone[]
  start: number
  end: number
  stats: { value: string; label: string }[]
  todayLabel: string
  /** 543 → tick labels in the Buddhist era (Thai pages) */
  yearOffset?: number
}) {
  const pos = (y: number) => ((y - start) / (end - start)) * 100
  const ticks: number[] = []
  for (let y = start; y <= end; y += 2) ticks.push(y)

  return (
    <div className="mt-12">
      {/* Key figures, taken from the milestones below */}
      <dl className="grid gap-px overflow-hidden rounded-xl border border-white/15 bg-white/15 sm:grid-cols-3">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08} className="bg-black p-5">
            <dt className="text-sm text-white/70">{s.label}</dt>
            <dd className="mt-1 text-3xl font-bold tracking-tight text-white"><CountUp value={s.value} /></dd>
          </Reveal>
        ))}
      </dl>

      {/* Desktop: proportional axis */}
      <div className="relative mt-14 hidden h-[26rem] md:block" aria-hidden="true">
        {/* axis */}
        <DrawLine className="absolute top-1/2 right-0 left-0 h-0.5 -translate-y-1/2 bg-white/50" />
        {ticks.map((y) => (
          <div key={y} className="absolute top-1/2" style={{ left: `${pos(y)}%` }}>
            <div className="h-2 w-px -translate-y-1 bg-white/40" />
            {(y - start) % 4 === 0 && (
              <span className="absolute top-3 -translate-x-1/2 text-xs text-white/50 tabular-nums">{y + yearOffset}</span>
            )}
          </div>
        ))}
        {items.map((m, i) => {
          const Icon = ICONS[m.kind]
          const above = i % 2 === 0
          const left = pos(m.from)
          const width = m.to ? pos(m.to) - left : 0
          const alignRight = left > 80
          return (
            <div key={m.label}>
              {/* period band */}
              {m.to && (
                <div className="absolute top-1/2 h-4 -translate-y-1/2 rounded-full bg-white" style={{ left: `${left}%`, width: `${width}%` }} />
              )}
              {/* dot */}
              <div className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-black bg-white" style={{ left: `${left}%` }} />
              {/* stem */}
              <div
                className="absolute w-px bg-white/30"
                style={{ left: `${left}%`, top: above ? '22%' : '50%', height: '28%' }}
              />
              {/* card */}
              <div
                className={`absolute w-52 ${alignRight ? '-translate-x-full' : left < 5 ? '' : '-translate-x-1/2'}`}
                style={{ left: `${left}%`, ...(above ? { bottom: '78%' } : { top: '78%' }) }}
              >
                <div className="flex items-center gap-2 text-white">
                  <Icon size={20} weight="duotone" aria-hidden="true" />
                  <span className="text-sm font-bold tabular-nums">{m.label}</span>
                </div>
                <p className="mt-1 text-base font-semibold leading-snug text-white">{m.title}</p>
              </div>
            </div>
          )
        })}
        <span className="absolute top-1/2 right-0 translate-y-3 text-xs font-semibold text-white/70">{todayLabel}</span>
      </div>

      {/* Full text — vertical rail on mobile, detail list under the axis on desktop */}
      <ol className="mt-10 grid gap-6 md:mt-4 md:grid-cols-3 md:gap-x-8">
        {items.map((m) => {
          const Icon = ICONS[m.kind]
          return (
            <Reveal as="li" key={m.label} delay={0} className="relative border-l border-white/25 pl-6">
              <span className="absolute top-0.5 -left-[11px] flex h-[22px] w-[22px] items-center justify-center rounded-full bg-black text-white">
                <Icon size={18} weight="duotone" aria-hidden="true" />
              </span>
              <span className="text-sm font-bold text-white tabular-nums">{m.label}</span>
              <p className="mt-1 font-semibold text-white">{m.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-white/75">{m.body}</p>
            </Reveal>
          )
        })}
      </ol>
    </div>
  )
}
