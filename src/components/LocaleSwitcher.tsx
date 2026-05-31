'use client'

import { useLocale } from 'next-intl'
import { usePathname, Link } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'

const labels: Record<string, string> = { en: 'EN', th: 'TH' }

/** Switches locale while staying on the current path. */
export function LocaleSwitcher() {
  const active = useLocale()
  const pathname = usePathname()

  return (
    <div className="flex items-center gap-1 text-sm font-semibold tracking-wide">
      {routing.locales.map((loc, i) => (
        <span key={loc} className="flex items-center gap-1">
          {i > 0 && <span className="text-white/40">·</span>}
          <Link
            href={pathname}
            locale={loc}
            className={
              loc === active
                ? 'text-brand-yellow'
                : 'text-white/70 transition-colors hover:text-white'
            }
          >
            {labels[loc] ?? loc.toUpperCase()}
          </Link>
        </span>
      ))}
    </div>
  )
}
