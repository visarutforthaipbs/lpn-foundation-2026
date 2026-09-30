'use client'

import { useEffect, useState } from 'react'
import { Link } from '@/i18n/navigation'

type NavItem = { href: string; label: string }

/**
 * Mobile navigation disclosure. Closes on Escape and on route change (click),
 * exposes proper aria-expanded/controls state, 44px tap targets.
 */
export function MobileMenu({
  items,
  donate,
  isThai,
}: {
  items: NavItem[]
  donate: NavItem
  isThai: boolean
}) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={isThai ? 'เปิดเมนู' : 'Open menu'}
        onClick={() => setOpen((v) => !v)}
        className="flex h-11 w-11 items-center justify-center border border-white/25 text-white transition-colors hover:border-white/60"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="h-5 w-5"
          aria-hidden="true"
        >
          {open ? (
            <path d="M6 6l12 12M18 6L6 18" />
          ) : (
            <path d="M4 7h16M4 12h16M4 17h16" />
          )}
        </svg>
      </button>

      {open && (
        <nav
          id="mobile-nav"
          aria-label={isThai ? 'เมนูหลัก' : 'Main menu'}
          className="absolute inset-x-0 top-full border-b border-white/10 bg-black/97 backdrop-blur-lg"
        >
          <ul className="mx-auto max-w-7xl px-4 py-3">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-12 items-center border-b border-white/10 text-xs font-black uppercase tracking-[0.22em] text-white/85 transition-colors hover:text-brand-yellow"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mx-auto max-w-7xl px-4 pb-5 pt-2">
            <Link
              href={donate.href}
              onClick={() => setOpen(false)}
              className="btn btn-primary w-full"
            >
              {donate.label}
            </Link>
          </div>
        </nav>
      )}
    </div>
  )
}
