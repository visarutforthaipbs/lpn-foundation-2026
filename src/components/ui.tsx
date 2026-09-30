import React from 'react'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'

/**
 * UI primitives for the LPN frontend. Server-component safe — no client hooks.
 * Visual law: docs/DESIGN-GUARDRAILS.md. Type/spacing via styles.css classes
 * (.t-display, .t-h2, .eyebrow, .btn-*, .card …) — prefer these over ad-hoc
 * Tailwind stacks so every page keeps the same rhythm.
 */

/* ---------------------------------------------------------------- containers */

export function Container({
  children,
  className = '',
  narrow = false,
}: {
  children: React.ReactNode
  className?: string
  narrow?: boolean
}) {
  return <div className={`${narrow ? 'container-narrow' : 'container-page'} ${className}`}>{children}</div>
}

export function Section({
  children,
  className = '',
  tone = 'light',
  tight = false,
  id,
}: {
  children: React.ReactNode
  className?: string
  tone?: 'light' | 'dark' | 'yellow' | 'paper'
  tight?: boolean
  id?: string
}) {
  const tones = {
    light: 'bg-white text-black on-light',
    paper: 'bg-paper text-black on-light',
    dark: 'bg-black text-white',
    yellow: 'bg-brand-yellow text-black on-light',
  }
  return (
    <section id={id} className={`${tones[tone]} ${tight ? 'section-tight' : 'section'} ${className}`}>
      {children}
    </section>
  )
}

/* -------------------------------------------------------------------- labels */

export function Eyebrow({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return <span className={`eyebrow text-brand-yellow ${className}`}>{children}</span>
}

/** Eyebrow + title + optional lede. One per section — this IS the section header. */
export function SectionHeading({
  eyebrow,
  title,
  lede,
  align = 'left',
  tone = 'dark',
  className = '',
}: {
  eyebrow?: React.ReactNode
  title: React.ReactNode
  lede?: React.ReactNode
  align?: 'left' | 'center'
  tone?: 'dark' | 'light'
  className?: string
}) {
  return (
    <div
      className={`max-w-3xl ${align === 'center' ? 'mx-auto text-center' : ''} ${className}`}
    >
      {eyebrow && (
        <Eyebrow className={align === 'center' ? 'justify-center' : ''}>{eyebrow}</Eyebrow>
      )}
      <h2
        className={`t-h2 mt-5 ${tone === 'dark' ? 'text-black' : 'text-white'}`}
      >
        {title}
      </h2>
      {lede && (
        <p
          className={`t-lede mt-5 ${tone === 'dark' ? 'text-black/70' : 'text-white/75'}`}
        >
          {lede}
        </p>
      )}
    </div>
  )
}

/* -------------------------------------------------------------------- links */

const buttonClass = {
  primary: 'btn btn-primary',
  ghostLight: 'btn btn-ghost-light',
  ghostDark: 'btn btn-ghost-dark',
  solidDark: 'btn btn-solid-dark',
}

/** Locale-aware internal button, or plain <a> for external / tel: / mailto:. */
export function ButtonLink({
  href,
  variant = 'primary',
  children,
  className = '',
}: {
  href: string
  variant?: keyof typeof buttonClass
  children: React.ReactNode
  className?: string
}) {
  const cls = `${buttonClass[variant]} ${className}`
  const internal = href.startsWith('/') && !href.startsWith('//')
  return internal ? (
    <Link href={href} className={cls}>
      {children}
    </Link>
  ) : (
    <a href={href} className={cls}>
      {children}
    </a>
  )
}

/** Understated inline link with a yellow underline mark. */
export function MarkLink({
  href,
  children,
  className = '',
}: {
  href: string
  children: React.ReactNode
  className?: string
}) {
  const internal = href.startsWith('/') && !href.startsWith('//')
  const cls = `link-mark ${className}`
  return internal ? (
    <Link href={href} className={cls}>
      {children}
    </Link>
  ) : (
    <a href={href} className={cls}>
      {children}
    </a>
  )
}

/* -------------------------------------------------------------------- stats */

export type Stat = { value: string; label: string }

/**
 * Stat band. Max 4 items — beyond that it stops being glanceable (Signal 39).
 * tone: yellow = brand band, dark = on black, light = on white.
 */
export function StatBand({
  stats,
  tone = 'yellow',
  className = '',
}: {
  stats: Stat[]
  tone?: 'yellow' | 'dark' | 'light'
  className?: string
}) {
  const item = {
    yellow: 'border-black/25 text-black',
    dark: 'border-white/20 text-white',
    light: 'border-black/15 text-black',
  }[tone]
  const label = {
    yellow: 'text-black/65',
    dark: 'text-white/55',
    light: 'text-black/55',
  }[tone]
  return (
    <dl className={`grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4 ${className}`}>
      {stats.map((s) => (
        <div key={s.label} className={`border-l pl-4 ${item}`}>
          <dt className={`t-label mt-2 ${label}`}>{s.label}</dt>
          <dd className="stat-value mt-1.5">{s.value}</dd>
        </div>
      ))}
    </dl>
  )
}

/* --------------------------------------------------------------------- hero */

/**
 * Page hero — dark, photography-led (brand rule: human-centered imagery with a
 * strong-contrast treatment). `compact` for interior pages, `full` for home.
 */
export function PageHero({
  eyebrow,
  title,
  lede,
  stats,
  actions,
  compact = false,
  children,
}: {
  eyebrow?: React.ReactNode
  title: React.ReactNode
  lede?: React.ReactNode
  stats?: Stat[]
  actions?: React.ReactNode
  compact?: boolean
  children?: React.ReactNode
}) {
  return (
    <section className="relative isolate overflow-hidden bg-black text-white">
      <Image
        src="/images/trawler-hero.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center opacity-30"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black via-black/75 to-black/35" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,0,0,0.05)_0%,rgba(0,0,0,0.85)_85%)]" />

      <div className={`container-page relative z-10 ${compact ? 'py-20 md:py-24' : 'py-24 md:py-32'}`}>
        <div className="max-w-4xl">
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          <h1 className={`mt-6 ${compact ? 't-display-sm' : 't-display'}`}>{title}</h1>
          {lede && <p className="t-lede mt-7 max-w-2xl text-white/85">{lede}</p>}
          {actions && <div className="mt-9 flex flex-wrap gap-3">{actions}</div>}
          {children}
          {stats && stats.length > 0 && (
            <StatBand stats={stats} tone="dark" className="mt-14 max-w-2xl border-l-4 border-brand-yellow pl-6" />
          )}
        </div>
      </div>
    </section>
  )
}

/* --------------------------------------------------------------------- CTA */

/** Closing call-to-action band. One per page, at the bottom. */
export function CtaBand({
  heading,
  body,
  actions,
}: {
  heading: React.ReactNode
  body?: React.ReactNode
  actions?: React.ReactNode
}) {
  return (
    <Section tone="yellow" tight className="border-t border-black">
      <div className="container-page flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <h2 className="t-h2">{heading}</h2>
          {body && <p className="mt-4 text-base leading-relaxed text-black/75">{body}</p>}
        </div>
        {actions && <div className="flex shrink-0 flex-wrap gap-3">{actions}</div>}
      </div>
    </Section>
  )
}

/* ---------------------------------------------------------- editorial row */

/**
 * Numbered editorial row — the alternative to equal-weight card grids when a
 * list carries the meaning (services, issues, steps). Uses a big quiet numeral
 * and type hierarchy instead of a yellow rail per card.
 */
export function EditorialRow({
  index,
  title,
  body,
  meta,
  actions,
  className = '',
}: {
  index?: string | number
  title: React.ReactNode
  body?: React.ReactNode
  meta?: React.ReactNode
  actions?: React.ReactNode
  className?: string
}) {
  return (
    <article
      className={`grid gap-x-10 gap-y-4 border-t border-black/15 py-10 md:grid-cols-[auto_1fr_auto] ${className}`}
    >
      {index !== undefined && (
        <div className="text-xs font-black uppercase tracking-[0.3em] text-black/35 md:pt-1.5">
          {index}
        </div>
      )}
      <div>
        <h3 className="t-h3">{title}</h3>
        {body && <p className="mt-3 max-w-2xl text-base leading-relaxed text-black/70">{body}</p>}
        {meta && <div className="mt-4">{meta}</div>}
      </div>
      {actions && <div className="flex items-start">{actions}</div>}
    </article>
  )
}
