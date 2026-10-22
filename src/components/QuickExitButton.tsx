'use client'

import { useCallback, useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { SignOut } from '@phosphor-icons/react'

/**
 * Quick Exit — PRD v1.1 §6.4, brand §10 vocabulary "ออกทันที".
 * Rendered only on worker-facing pages (today: /[locale]/get-help).
 * Click or Escape: clear sessionStorage, drop any intake keys from
 * localStorage, then replace the page with Google so Back does not return.
 * Behaviour mirrors right-guide/src/app/components/QuickExitButton.tsx.
 *
 * It sits fixed on the right, just under the sticky site header, so it never
 * covers the locale switcher or the menu button.
 */

const INTAKE_STORAGE_PREFIX = 'lpn-intake'
const HEADER_GAP = 12

export function quickExit(): void {
  try {
    sessionStorage.clear()
  } catch {
    /* storage blocked */
  }
  try {
    for (const key of Object.keys(localStorage)) {
      if (key.startsWith(INTAKE_STORAGE_PREFIX)) localStorage.removeItem(key)
    }
  } catch {
    /* storage blocked */
  }
  window.location.replace('https://www.google.com')
}

export default function QuickExitButton() {
  const t = useTranslations('quickExit')
  const [top, setTop] = useState<number>(HEADER_GAP)
  const onExit = useCallback(() => quickExit(), [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        quickExit()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    const header = document.querySelector('header')
    if (!header) return
    const measure = () => setTop(Math.round(header.getBoundingClientRect().height) + HEADER_GAP)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(header)
    return () => ro.disconnect()
  }, [])

  return (
    <button
      type="button"
      onClick={onExit}
      aria-label={t('aria')}
      title={t('aria')}
      className="quick-exit"
      style={{ top }}
      data-testid="quick-exit"
    >
      <SignOut size={20} weight="regular" aria-hidden="true" />
      <span>{t('label')}</span>
    </button>
  )
}
