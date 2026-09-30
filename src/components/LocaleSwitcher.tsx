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
    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em]">
      {routing.locales.map((loc, i) => (
        <span key={loc} className="flex items-center gap-2">
          {i > 0 && (
            <span className="text-white/70" aria-hidden="true">
              /
            </span>
          )}
          <Link
            href={pathname}
            locale={loc}
            lang={loc}
            aria-current={loc === active ? 'true' : undefined}
            aria-label={loc === 'th' ? 'สลับเป็นภาษาไทย' : 'Switch to English'}
            className={`inline-flex min-h-11 min-w-11 items-center justify-center px-2 ${
              loc === active
                ? 'text-brand-yellow font-black'
                : 'text-white/75 transition-colors hover:text-white'
            }`}
          >
            {labels[loc] ?? loc.toUpperCase()}
          </Link>
        </span>
      ))}
    </div>
  )
}
