import type { Locale } from '@/i18n/routing'
import { getFooter } from '@/lib/api'

export async function SiteFooter({ locale }: { locale: Locale }) {
  const footer = await getFooter(locale)

  return (
    <footer className="mt-20 border-t border-white/10 bg-black text-white/70">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <img src="/logos/lpn-logo-white.svg" alt="LPN Foundation" className="h-6 w-auto" />
          <span className="text-xs text-white/45">© {new Date().getFullYear()} LPN Foundation</span>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
          {footer?.hotlines?.map((h) => (
            <a
              key={h.id ?? h.phone}
              href={`tel:${h.phone}`}
              className="transition-colors hover:text-brand-yellow"
            >
              {h.phone}
            </a>
          ))}
          {footer?.socials?.map((s) => (
            <a
              key={s.id ?? s.url}
              href={s.url}
              className="transition-colors hover:text-brand-yellow"
              target="_blank"
              rel="noopener noreferrer"
            >
              {s.platform}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
