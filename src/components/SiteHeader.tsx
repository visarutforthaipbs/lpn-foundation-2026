import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { getHeader } from '@/lib/api'
import { MediaImage } from './MediaImage'
import { LocaleSwitcher } from './LocaleSwitcher'

export async function SiteHeader({ locale }: { locale: Locale }) {
  const header = await getHeader(locale)
  const navItems = header?.navItems ?? []

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/95 text-white backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="flex items-center gap-3 font-bold text-white group">
          <img src="/logos/lpn-logo-white.svg" alt="LPN Foundation" className="h-6 w-auto transition-transform group-hover:scale-[1.02]" />
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.id ?? item.href}
              href={item.href}
              className="text-sm font-semibold text-white/90 transition-colors hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <LocaleSwitcher />
          <Link
            href={header?.donateHref || '/donate'}
            className="rounded-full border border-brand-yellow bg-brand-yellow px-4 py-2 text-sm font-semibold text-black transition-all hover:bg-black hover:text-brand-yellow"
          >
            {header?.donateLabel || 'Donate'}
          </Link>
        </div>
      </div>
    </header>
  )
}
