'use client'

/**
 * Motion primitives for the LPN site (library: `motion`, successor of Framer Motion).
 *
 * House rules (docs/DESIGN-GUARDRAILS.md — "motion should signal change, not ornament"):
 *  - Motion only fires ONCE, when content scrolls into view. Nothing loops, nothing moves on hover.
 *  - Short and quiet: 12 px rise + fade, ≤ 0.5 s, ease-out. No bounce, no parallax, no scale.
 *  - Content is in the server HTML and visible without JS. The "hidden" start state is applied only after hydration,
 *    and only if the element is still below the fold — so there is no flash and no blank page for crawlers.
 *  - `prefers-reduced-motion: reduce` → everything renders in its final state, instantly (MotionConfig reducedMotion).
 */

import { useEffect, useRef, useState } from 'react'
import { animate, MotionConfig, motion, useInView, useReducedMotion } from 'motion/react'

const EASE = [0.22, 1, 0.36, 1] as const

/** Wrap the app once: makes every motion component honour the OS "reduce motion" setting. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ duration: 0.45, ease: EASE }}>
      {children}
    </MotionConfig>
  )
}

/**
 * Fade + small rise when scrolled into view (once). `delay` lets siblings follow each other (use `index * 0.06`).
 * Starts visible on the server; hides only after mount if it is below the viewport, then reveals on scroll.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as = 'div',
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  as?: 'div' | 'li' | 'section' | 'p' | 'dl' | 'article'
}) {
  const ref = useRef<HTMLElement | null>(null)
  const reduce = useReducedMotion()
  const inView = useInView(ref, { once: true, margin: '0px 0px -12% 0px' })
  const [armed, setArmed] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || reduce) return
    // Only arm (hide) when the element starts below the fold; anything already on screen stays put.
    const r = el.getBoundingClientRect()
    if (r.top > window.innerHeight * 0.88) setArmed(true)
  }, [reduce])

  const M = motion[as] as typeof motion.div
  return (
    <M
      ref={ref as React.Ref<HTMLDivElement>}
      className={className}
      initial={false}
      animate={armed && !inView ? { opacity: 0, y: 12 } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: EASE, delay: armed ? delay : 0 }}
    >
      {children}
    </M>
  )
}

/**
 * Number that counts up once when it scrolls into view. Only for plain integers (optionally "1,200" or "2,000+").
 * Years (≥ 2000 without a comma, e.g. "2560") and anything non-numeric ("7 ใน 10") render as static text.
 * The final value is always in the DOM text, so screen readers and crawlers read the real number.
 */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const m = /^(\d{1,3}(?:,\d{3})+|\d{1,4})(\+?)$/.exec(value.trim())
  const target = m ? Number(m[1].replace(/,/g, '')) : NaN
  const isYear = m ? !m[1].includes(',') && target >= 1900 : false
  const animatable = m !== null && !isYear && target > 1

  const ref = useRef<HTMLSpanElement | null>(null)
  const reduce = useReducedMotion()
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })

  useEffect(() => {
    const el = ref.current
    if (!animatable || reduce || !inView || !el) return
    const grouped = m![1].includes(',')
    const suffix = m![2]
    const controls = animate(0, target, {
      duration: 1.1,
      ease: EASE,
      onUpdate: (v) => {
        const n = Math.round(v)
        el.textContent = (grouped ? n.toLocaleString('en-US') : String(n)) + suffix
      },
      onComplete: () => {
        el.textContent = value
      },
    })
    return () => controls.stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduce, animatable, target, value])

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  )
}

/**
 * Hero text entrance: children rise in once, in order, on first paint (heroes are above the fold, so this is load-time
 * not scroll-time). Server HTML is fully visible; JS only plays a 0.5 s settle. Reduced motion → no movement.
 */
export function HeroIn({ children, className }: { children: React.ReactNode; className?: string }) {
  // `initial={false}` on BOTH server and client (no useReducedMotion branch → no hydration mismatch). The entrance is
  // started after mount only when motion is allowed; with reduced motion the element simply stays in its final state.
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || reduce) return
    const c = animate(el, { opacity: [0.001, 1], transform: ['translateY(14px)', 'translateY(0px)'] }, { duration: 0.5, ease: EASE })
    return () => c.stop()
  }, [reduce])
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}

/** A line that draws left→right when scrolled into view (timeline axis). Pure transform, once. */
export function DrawLine({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null)
  const reduce = useReducedMotion()
  const inView = useInView(ref, { once: true, margin: '0px 0px -15% 0px' })
  const [armed, setArmed] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || reduce) return
    if (el.getBoundingClientRect().top > window.innerHeight * 0.9) setArmed(true)
  }, [reduce])

  return (
    <motion.div
      ref={ref}
      aria-hidden="true"
      className={className}
      style={{ transformOrigin: 'left center' }}
      initial={false}
      animate={{ scaleX: armed && !inView ? 0 : 1 }}
      transition={{ duration: 1.2, ease: EASE }}
    />
  )
}
