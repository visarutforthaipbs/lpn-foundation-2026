'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { CaretDown, Check, Globe } from '@phosphor-icons/react'
import { useLocale } from 'next-intl'
import { usePathname, Link } from '@/i18n/navigation'
import { routing, type Locale } from '@/i18n/routing'
import { LOCALE_META } from '@/i18n/locales'

/** "Switch to <language>" in that language (tooltip), so a reader finds their own script. */
const SWITCH_LABEL: Record<Locale, string> = {
  en: 'Switch to English',
  th: 'สลับเป็นภาษาไทย',
  my: 'မြန်မာဘာသာသို့ ပြောင်းရန်',
  km: 'ប្ដូរទៅភាសាខ្មែរ',
  lo: 'ປ່ຽນເປັນພາສາລາວ',
}

/**
 * Five-language switcher (English · ไทย · မြန်မာ · ខ្មែរ · ລາວ) that keeps the current path.
 * - `strip` (header utility strip): inline links from md up; a compact disclosure below md.
 * - `menu` (MobileMenu): a wrapping row of 44 px pills.
 * Each label carries its own `lang`, so it renders in a font for that script; the visible
 * native name is the accessible name (label-in-name), the switch phrase is a tooltip.
 */
export function LocaleSwitcher({ variant = 'strip', label = 'Language' }: { variant?: 'strip' | 'menu'; label?: string }) {
  const active = useLocale() as Locale
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const boxRef = useRef<HTMLDivElement>(null)
  const listId = useId()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    const onClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('mousedown', onClick)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('mousedown', onClick)
    }
  }, [open])

  const link = (loc: Locale, className: string, check = false) => (
    <Link
      key={loc}
      href={pathname}
      locale={loc}
      lang={loc}
      hrefLang={loc}
      title={SWITCH_LABEL[loc]}
      aria-current={loc === active ? 'true' : undefined}
      onClick={() => setOpen(false)}
      className={className}
    >
      {LOCALE_META[loc].native}
      {check && loc === active && <Check size={18} aria-hidden="true" />}
    </Link>
  )

  if (variant === 'menu') {
    return (
      <nav aria-label={label} className="flex flex-wrap gap-2">
        {routing.locales.map((loc) =>
          link(
            loc,
            `inline-flex min-h-11 items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-semibold ${
              loc === active ? 'border-brand-yellow bg-brand-yellow text-black' : 'border-white/30 text-white/85 hover:border-white'
            }`,
          ),
        )}
      </nav>
    )
  }

  return (
    <div ref={boxRef} className="relative">
      {/* md and up: every language visible at once */}
      <nav aria-label={label} className="hidden items-center md:flex">
        {routing.locales.map((loc) =>
          link(
            loc,
            `inline-flex min-h-11 min-w-11 items-center justify-center px-2.5 text-sm font-semibold ${
              loc === active ? 'text-brand-yellow' : 'text-white/75 transition-colors hover:text-white'
            }`,
          ),
        )}
      </nav>

      {/* below md: one compact button → list */}
      <button
        type="button"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex min-h-11 items-center gap-1.5 px-2 text-sm font-semibold text-white/85 md:hidden"
      >
        <Globe size={20} aria-hidden="true" />
        <span className="sr-only">{label}: </span>
        <span lang={active}>{LOCALE_META[active].native}</span>
        <CaretDown size={16} aria-hidden="true" className={open ? 'rotate-180' : ''} />
      </button>
      {open && (
        <ul
          id={listId}
          className="absolute right-0 top-full z-[60] mt-1 min-w-44 rounded-lg border border-white/15 bg-black py-1 shadow-lg md:hidden"
        >
          {routing.locales.map((loc) => (
            <li key={loc}>
              {link(
                loc,
                `flex min-h-11 items-center justify-between gap-3 px-4 text-base ${
                  loc === active ? 'font-bold text-brand-yellow' : 'text-white/85 hover:text-white'
                }`,
                true,
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
