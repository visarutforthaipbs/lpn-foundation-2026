'use client'

import { useEffect, useState } from 'react'
import { List, X } from '@phosphor-icons/react'
import { Link } from '@/i18n/navigation'
import { ButtonLink } from './ui'
import { LocaleSwitcher } from './LocaleSwitcher'

type NavItem = { href: string; label: string }

/**
 * Mobile navigation disclosure. Closes on Escape and on route change (click),
 * exposes proper aria-expanded/controls state, 44px tap targets.
 */
export function MobileMenu({
  items,
  donate,
  labels,
}: {
  items: NavItem[]
  donate: NavItem
  labels: { open: string; nav: string; language: string }
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
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={labels.open}
        onClick={() => setOpen((v) => !v)}
        className="tactile-icon-btn h-11 w-11 text-white hover:text-brand-yellow"
      >
        {open ? <X size={24} aria-hidden="true" /> : <List size={24} aria-hidden="true" />}
      </button>

      {open && (
        <nav
          id="mobile-nav"
          aria-label={labels.nav}
          className="absolute inset-x-0 top-full border-b border-white/10 bg-black/97 backdrop-blur-lg"
        >
          <ul className="mx-auto max-w-7xl px-4 py-3">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-12 items-center border-b border-white/10 text-xs font-semibold  text-white/85 transition-colors hover:text-brand-yellow"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mx-auto max-w-7xl px-4 pt-3">
            <p className="t-label mb-2 text-white/70">{labels.language}</p>
            <LocaleSwitcher variant="menu" label={labels.language} />
          </div>
          <div className="mx-auto max-w-7xl px-4 pb-5 pt-4">
            <ButtonLink
              href={donate.href}
              variant="primary"
              className="w-full"
              onClick={() => setOpen(false)}
            >
              {donate.label}
            </ButtonLink>
          </div>
        </nav>
      )}
    </div>
  )
}
