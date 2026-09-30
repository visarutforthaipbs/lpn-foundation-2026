import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
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
  tone = 'light',
  className = '',
}: {
  children: React.ReactNode
  tone?: 'light' | 'dark'
  className?: string
}) {
  const textColor = tone === 'dark' ? 'text-black' : 'text-brand-yellow'
  return <span className={`eyebrow ${textColor} ${className}`}>{children}</span>
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
        <Eyebrow tone={tone} className={align === 'center' ? 'justify-center' : ''}>{eyebrow}</Eyebrow>
      )}
      <h2
        className={`t-h2 mt-5 ${tone === 'dark' ? 'text-black' : 'text-white'}`}
      >
        {title}
      </h2>
      {lede && (
        <p
          className={`t-lede mt-5 ${tone === 'dark' ? 'text-black/75' : 'text-white/80'}`}
        >
          {lede}
        </p>
      )}
    </div>
  )
}

/* -------------------------------------------------------------------- links */

/**
 * Typed button variants (class-variance-authority per thai-agency-frontend-standards).
 * Visual implementation lives in styles.css `.btn*` classes — their metrics
 * encode the Thai-safety rules: min-height 44px + py (never fixed heights),
 * leading-normal, disabled states, 200ms cubic-bezier(0.16,1,0.3,1) motion.
 */
export const buttonVariants = cva('btn', {
  variants: {
    variant: {
      primary: 'btn-primary',
      ghostLight: 'btn-ghost-light',
      ghostDark: 'btn-ghost-dark',
      solidDark: 'btn-solid-dark',
    },
  },
  defaultVariants: { variant: 'primary' },
})

/** Locale-aware internal button, or plain <a> for external / tel: / mailto:. */
export function ButtonLink({
  href,
  variant,
  children,
  className = '',
  disabled = false,
  onClick,
  ariaLabel,
}: {
  href: string
  variant?: VariantProps<typeof buttonVariants>['variant']
  children: React.ReactNode
  className?: string
  disabled?: boolean
  onClick?: () => void
  ariaLabel?: string
}) {
  const cls = buttonVariants({ variant, className })
  const internal = href.startsWith('/') && !href.startsWith('//')
  if (disabled) {
    return (
      <span className={cls} aria-disabled="true" role="link">
        {children}
      </span>
    )
  }
  return internal ? (
    <Link href={href} className={cls} onClick={onClick} aria-label={ariaLabel}>
      {children}
    </Link>
  ) : (
    <a href={href} className={cls} onClick={onClick} aria-label={ariaLabel}>
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
    yellow: 'text-black/85',
    dark: 'text-white/70',
    light: 'text-black/70',
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
 * Page hero — a neutral typographic treatment for topics that extend beyond
 * the foundation's historical fishing rescues. `compact` for interior pages.
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
      <div className="pointer-events-none absolute right-0 top-0 h-full w-[42%] border-l border-white/10 bg-[linear-gradient(135deg,transparent_0%,rgba(255,199,0,0.12)_100%)]" aria-hidden="true" />

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
        <div className="text-xs font-black uppercase tracking-[0.3em] text-black/65 md:pt-1.5">
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
