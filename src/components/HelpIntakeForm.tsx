'use client'

import { useCallback, useEffect, useId, useRef, useState, type FormEvent, type RefObject } from 'react'
import { useTranslations } from 'next-intl'
import { ArrowsClockwise, ChatCircleDots, NotePencil, PaperPlaneTilt, Phone, WarningCircle } from '@phosphor-icons/react'
import { PROVINCES } from '@/lib/provinces'

/**
 * Help-intake form — M1, PRD v1.1 §7.2. Posts to the intake API (M2) only;
 * it never touches Payload / Neon (README rule 1, AGENTS.md §5).
 *
 * - text (1–4000, required), language (th/en/my/km), province (optional,
 *   datalist), contact (optional ≤120), consent checkbox (consent_version).
 * - Cloudflare Turnstile loaded lazily when the form scrolls into view; in
 *   non-production the literal token "dev" is used if the script cannot load.
 * - 10 s timeout. Success → tracking code, large, "write this down".
 *   Timeout / network / 5xx → fallback panel with the hotline channels passed
 *   in by the page (never hard-coded here) + Messenger.
 */

export const CONSENT_VERSION = '2026-01'
const TEXT_MAX = 4000
const CONTACT_MAX = 120
const TIMEOUT_MS = 10_000

const INTAKE_URL = (process.env.NEXT_PUBLIC_INTAKE_URL || 'http://localhost:3100').replace(/\/$/, '')
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'
const TURNSTILE_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
const IS_DEV = process.env.NODE_ENV !== 'production'

export type HelpChannel = {
  code: string
  /** Language name in the page locale, e.g. "ภาษาพม่า" / "Burmese". */
  label: string
  /** Native-script label, e.g. "မြန်မာ"; empty for the page's own language. */
  native?: string
  nativeLang?: string
  phone: string
  href: string
}

export type IntakeLanguage = 'th' | 'en' | 'my' | 'km'
const LANGUAGES: { value: IntakeLanguage; label: string }[] = [
  { value: 'th', label: 'ภาษาไทย' },
  { value: 'en', label: 'English' },
  { value: 'my', label: 'မြန်မာ' },
  { value: 'km', label: 'ភាសាខ្មែរ' },
]

/* ------------------------------------------------------------ Turnstile */

type TurnstileApi = {
  render: (
    el: HTMLElement,
    opts: {
      sitekey: string
      callback: (token: string) => void
      'error-callback'?: () => void
      'expired-callback'?: () => void
      appearance?: 'always' | 'execute' | 'interaction-only'
      size?: 'normal' | 'compact' | 'flexible'
      theme?: 'light' | 'dark' | 'auto'
      language?: string
    },
  ) => string
  reset: (id?: string) => void
  remove: (id?: string) => void
}

declare global {
  interface Window {
    turnstile?: TurnstileApi
  }
}

let turnstileScript: Promise<TurnstileApi | null> | null = null

function loadTurnstile(): Promise<TurnstileApi | null> {
  if (typeof window === 'undefined') return Promise.resolve(null)
  if (window.turnstile) return Promise.resolve(window.turnstile)
  if (turnstileScript) return turnstileScript
  turnstileScript = new Promise((resolve) => {
    const s = document.createElement('script')
    s.src = TURNSTILE_SRC
    s.async = true
    s.defer = true
    s.onload = () => resolve(window.turnstile ?? null)
    s.onerror = () => resolve(null)
    document.head.appendChild(s)
  })
  return turnstileScript
}

/* ----------------------------------------------------------------- API */

export type SubmitResult =
  | { ok: true; trackingCode: string }
  | { ok: false; kind: 'rate_limited' }
  | { ok: false; kind: 'turnstile' }
  | { ok: false; kind: 'rejected'; error?: string }
  | { ok: false; kind: 'unavailable' } // timeout / network / 5xx → fallback panel

async function submitForm(body: {
  text: string
  language: IntakeLanguage
  province: string | null
  contact: string | null
  consent_version: string
  turnstile: string
}): Promise<SubmitResult> {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(`${INTAKE_URL}/api/intake/form`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: ctrl.signal,
      cache: 'no-store',
    })
    let data: { tracking_code?: string; error?: string } = {}
    try {
      data = await res.json()
    } catch {
      /* non-JSON body */
    }
    if (res.status === 201 && data.tracking_code) return { ok: true, trackingCode: data.tracking_code }
    if (res.status === 429) return { ok: false, kind: 'rate_limited' }
    if (res.status === 403) return { ok: false, kind: 'turnstile' }
    if (res.status === 400 || res.status === 413) return { ok: false, kind: 'rejected', error: data.error }
    return { ok: false, kind: 'unavailable' }
  } catch {
    return { ok: false, kind: 'unavailable' }
  } finally {
    clearTimeout(timer)
  }
}

/** "K7Q2M9XD" → "K7Q2 M9XD" (API.md). */
export function formatTrackingCode(code: string): string {
  const clean = code.replace(/[^0-9A-Za-z]/g, '').toUpperCase()
  return clean.length === 8 ? `${clean.slice(0, 4)} ${clean.slice(4)}` : clean
}

/**
 * Mounts the Turnstile widget lazily (IntersectionObserver) and removes it on
 * unmount, so switching to the success / fallback panel never leaves a
 * dangling widget id behind. Token state is shared with the form via refs.
 */
function TurnstileSlot({
  locale,
  tokenRef,
  widgetRef,
  scriptFailedRef,
  flushToken,
}: {
  locale: string
  tokenRef: RefObject<string | null>
  widgetRef: RefObject<string | null>
  scriptFailedRef: RefObject<boolean>
  flushToken: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let started = false
    let destroyed = false
    const mount = () => {
      loadTurnstile().then((api) => {
        if (destroyed) return
        if (!api) {
          scriptFailedRef.current = true
          if (IS_DEV) tokenRef.current = 'dev'
          flushToken()
          return
        }
        try {
          widgetRef.current = api.render(el, {
            sitekey: TURNSTILE_SITE_KEY,
            appearance: 'interaction-only',
            size: 'flexible',
            theme: 'auto',
            language: locale,
            callback: (tok) => {
              tokenRef.current = tok
              flushToken()
            },
            'expired-callback': () => {
              tokenRef.current = null
            },
            'error-callback': () => {
              if (IS_DEV) tokenRef.current = 'dev'
              flushToken()
            },
          })
        } catch {
          scriptFailedRef.current = true
          if (IS_DEV) tokenRef.current = 'dev'
          flushToken()
        }
      })
    }
    // The slot is display:none while empty, so observe the enclosing form:
    // the script starts loading as soon as the form itself scrolls into view.
    const target = el.closest('form') ?? el
    const io = new IntersectionObserver(
      (entries) => {
        if (started || !entries.some((e) => e.isIntersecting)) return
        started = true
        io.disconnect()
        mount()
      },
      { rootMargin: '200px 0px' },
    )
    io.observe(target)
    return () => {
      destroyed = true
      io.disconnect()
      if (widgetRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetRef.current)
        } catch {
          /* already removed */
        }
      }
      widgetRef.current = null
      tokenRef.current = null
    }
  }, [locale, tokenRef, widgetRef, scriptFailedRef, flushToken])

  return <div ref={ref} className="mt-4 empty:hidden" data-testid="turnstile" />
}

/* ----------------------------------------------------------- component */

type Phase = 'form' | 'submitting' | 'success' | 'fallback'

export default function HelpIntakeForm({
  locale,
  channels,
  messengerUrl,
}: {
  locale: 'th' | 'en'
  channels: HelpChannel[]
  messengerUrl: string
}) {
  const t = useTranslations('helpForm')
  const id = useId()

  const [text, setText] = useState('')
  const [language, setLanguage] = useState<IntakeLanguage>(locale)
  const [province, setProvince] = useState('')
  const [contact, setContact] = useState('')
  const [consent, setConsent] = useState(false)
  const [errors, setErrors] = useState<{ text?: string; contact?: string; consent?: string }>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [phase, setPhase] = useState<Phase>('form')
  const [trackingCode, setTrackingCode] = useState<string | null>(null)

  const rootRef = useRef<HTMLDivElement>(null)
  const errorRef = useRef<HTMLDivElement>(null)
  const codeHeadingRef = useRef<HTMLHeadingElement>(null)

  // Turnstile token state lives in refs: it never needs to re-render the form.
  const tokenRef = useRef<string | null>(null)
  const widgetRef = useRef<string | null>(null)
  const scriptFailedRef = useRef(false)
  const waitersRef = useRef<((t: string | null) => void)[]>([])

  const flushToken = useCallback(() => {
    const w = waitersRef.current
    waitersRef.current = []
    w.forEach((fn) => fn(tokenRef.current))
  }, [])

  const getToken = useCallback(
    () =>
      new Promise<string | null>((resolve) => {
        if (tokenRef.current) return resolve(tokenRef.current)
        if (scriptFailedRef.current) return resolve(IS_DEV ? 'dev' : null)
        const timer = setTimeout(() => {
          waitersRef.current = waitersRef.current.filter((w) => w !== done)
          resolve(IS_DEV ? 'dev' : null)
        }, TIMEOUT_MS)
        const done = (tok: string | null) => {
          clearTimeout(timer)
          resolve(tok)
        }
        waitersRef.current.push(done)
      }),
    [],
  )

  const resetToken = useCallback(() => {
    tokenRef.current = null
    if (widgetRef.current && window.turnstile) {
      try {
        window.turnstile.reset(widgetRef.current)
      } catch {
        /* widget gone */
      }
    }
  }, [])

  useEffect(() => {
    if (phase === 'success') codeHeadingRef.current?.focus()
  }, [phase])

  const validate = () => {
    const next: typeof errors = {}
    const trimmed = text.trim()
    if (trimmed.length < 1) next.text = t('errors.textRequired')
    else if (trimmed.length > TEXT_MAX) next.text = t('errors.textTooLong', { max: TEXT_MAX })
    if (contact.trim().length > CONTACT_MAX) next.contact = t('errors.contactTooLong', { max: CONTACT_MAX })
    if (!consent) next.consent = t('errors.consentRequired')
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setServerError(null)
    if (!validate()) return
    setPhase('submitting')
    const token = await getToken()
    if (!token) {
      setPhase('form')
      setServerError(t('errors.turnstile'))
      resetToken()
      return
    }
    const result = await submitForm({
      text: text.trim(),
      language,
      province: province.trim() || null,
      contact: contact.trim() || null,
      consent_version: CONSENT_VERSION,
      turnstile: token,
    })
    if (result.ok) {
      setTrackingCode(result.trackingCode)
      setPhase('success')
      return
    }
    if (result.kind === 'unavailable') {
      setPhase('fallback')
      return
    }
    setPhase('form')
    resetToken()
    if (result.kind === 'rate_limited') setServerError(t('errors.rateLimited'))
    else if (result.kind === 'turnstile') setServerError(t('errors.turnstile'))
    else if (result.error === 'consent_required') setServerError(t('errors.consentRequired'))
    else setServerError(t('errors.rejected'))
    requestAnimationFrame(() => errorRef.current?.focus())
  }

  const onDone = () => {
    // The code lives only in React state — never in storage (PRD §6.4).
    setTrackingCode(null)
    setText('')
    setProvince('')
    setContact('')
    setConsent(false)
    setErrors({})
    setServerError(null)
    resetToken()
    setPhase('form')
  }

  const onTryAgain = () => {
    setServerError(null)
    resetToken()
    setPhase('form')
  }

  const textLen = text.length
  const busy = phase === 'submitting'

  /* -------------------------------------------------------- success */
  if (phase === 'success' && trackingCode) {
    const shown = formatTrackingCode(trackingCode)
    return (
      <div ref={rootRef} className="card p-5 sm:p-8" data-testid="help-form-success" aria-live="polite">
        <span className="glass-tag inline-flex min-h-8 items-center px-3">{t('success.badge')}</span>
        <h3 ref={codeHeadingRef} tabIndex={-1} className="t-h3 mt-4 outline-none">
          {t('success.title')}
        </h3>
        <p className="mt-2 t-label text-black/70">{t('success.codeLabel')}</p>
        <div className="tracking-code mt-2" lang="en" data-testid="tracking-code" aria-label={`${t('success.codeLabel')} ${shown.split('').join(' ')}`}>
          {shown}
        </div>
        <p className="mt-5 flex items-start gap-3 text-base font-semibold leading-relaxed">
          <NotePencil size={24} aria-hidden="true" className="mt-0.5 shrink-0" />
          <span>{t('success.writeDown')}</span>
        </p>
        <p className="mt-3 text-sm leading-relaxed text-black/70">{t('success.notSaved')}</p>
        <button type="button" className="btn btn-solid-dark mt-6" onClick={onDone} data-testid="help-form-done">
          {t('success.done')}
        </button>
      </div>
    )
  }

  /* ------------------------------------------------------- fallback */
  if (phase === 'fallback') {
    return (
      <div ref={rootRef} className="card border-2 p-5 sm:p-8" data-testid="help-form-fallback" role="alert">
        <div className="flex items-start gap-3">
          <WarningCircle size={28} weight="fill" aria-hidden="true" className="mt-0.5 shrink-0 text-critical" />
          <div>
            <h3 className="t-h3">{t('fallback.title')}</h3>
            <p className="mt-2 text-base leading-relaxed text-black/80">{t('fallback.body')}</p>
          </div>
        </div>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {channels.map((c) => (
            <li key={c.code}>
              <a
                href={c.href}
                className="flex min-h-14 items-center justify-between gap-3 rounded-(--radius-control) border border-black bg-white px-4 py-3 font-semibold transition-colors hover:bg-black hover:text-white"
                aria-label={`${c.label}: ${c.phone}`}
                data-testid="fallback-hotline"
              >
                <span className="flex items-center gap-3">
                  <Phone size={22} aria-hidden="true" className="shrink-0" />
                  <span>
                    {c.native ? (
                      <>
                        <span className="block" lang={c.nativeLang}>{c.native}</span>
                        <span className="block text-sm text-black/70">{c.label}</span>
                      </>
                    ) : (
                      c.label
                    )}
                  </span>
                </span>
                <span className="font-mono text-base">{c.phone}</span>
              </a>
            </li>
          ))}
        </ul>
        <div className="mt-5 flex flex-wrap gap-3">
          <a href={messengerUrl} target="_blank" rel="noopener noreferrer" className="btn btn-solid-dark" data-testid="fallback-messenger">
            <ChatCircleDots size={20} aria-hidden="true" />
            {t('fallback.messenger')}
          </a>
          <button type="button" className="btn btn-ghost-dark" onClick={onTryAgain} data-testid="fallback-retry">
            <ArrowsClockwise size={20} aria-hidden="true" />
            {t('fallback.tryAgain')}
          </button>
        </div>
      </div>
    )
  }

  /* ----------------------------------------------------------- form */
  return (
    <div ref={rootRef}>
      <form onSubmit={onSubmit} noValidate className="card p-5 sm:p-8" data-testid="help-form" aria-busy={busy}>
        <p className="text-base leading-relaxed text-black/80">{t('intro')}</p>

        {serverError && (
          <div
            ref={errorRef}
            tabIndex={-1}
            role="alert"
            className="mt-5 flex items-start gap-3 rounded-(--radius-control) border border-critical bg-critical-tint p-4 text-critical-ink outline-none"
            data-testid="help-form-error"
          >
            <WarningCircle size={24} weight="fill" aria-hidden="true" className="mt-0.5 shrink-0" />
            <p className="text-base font-semibold leading-relaxed">{serverError}</p>
          </div>
        )}

        {/* what happened */}
        <div className="mt-6">
          <label htmlFor={`${id}-text`} className="block text-base font-bold">
            {t('fields.text.label')}{' '}
            <span className="font-normal text-black/70">{t('required')}</span>
          </label>
          <p id={`${id}-text-hint`} className="mt-1 text-sm leading-relaxed text-black/70">{t('fields.text.hint')}</p>
          <textarea
            id={`${id}-text`}
            name="text"
            className="field-input mt-2 min-h-40 resize-y"
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={TEXT_MAX + 50}
            required
            rows={6}
            disabled={busy}
            aria-invalid={errors.text ? 'true' : undefined}
            aria-describedby={`${id}-text-hint ${id}-text-count${errors.text ? ` ${id}-text-error` : ''}`}
            data-testid="field-text"
          />
          <div className="mt-1 flex flex-wrap justify-between gap-2">
            {errors.text ? <p id={`${id}-text-error`} className="field-error">{errors.text}</p> : <span />}
            <span id={`${id}-text-count`} className={`text-sm tabular-nums ${textLen > TEXT_MAX ? 'text-critical-ink font-semibold' : 'text-black/60'}`}>
              {textLen.toLocaleString(locale)} / {TEXT_MAX.toLocaleString(locale)}
            </span>
          </div>
        </div>

        {/* language + province */}
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor={`${id}-language`} className="block text-base font-bold">{t('fields.language.label')}</label>
            <select
              id={`${id}-language`}
              name="language"
              className="field-input mt-2"
              value={language}
              onChange={(e) => setLanguage(e.target.value as IntakeLanguage)}
              disabled={busy}
              data-testid="field-language"
            >
              {LANGUAGES.map((l) => (
                <option key={l.value} value={l.value} lang={l.value}>{l.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor={`${id}-province`} className="block text-base font-bold">
              {t('fields.province.label')}{' '}
              <span className="font-normal text-black/70">{t('optional')}</span>
            </label>
            <input
              id={`${id}-province`}
              name="province"
              type="text"
              className="field-input mt-2"
              list={`${id}-provinces`}
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              maxLength={80}
              autoComplete="off"
              placeholder={t('fields.province.placeholder')}
              disabled={busy}
              data-testid="field-province"
            />
            <datalist id={`${id}-provinces`}>
              {PROVINCES.map((p) => (
                <option key={p.en} value={locale === 'th' ? p.th : p.en}>{locale === 'th' ? p.en : p.th}</option>
              ))}
            </datalist>
          </div>
        </div>

        {/* contact */}
        <div className="mt-5">
          <label htmlFor={`${id}-contact`} className="block text-base font-bold">
            {t('fields.contact.label')}{' '}
            <span className="font-normal text-black/70">{t('optional')}</span>
          </label>
          <p id={`${id}-contact-hint`} className="mt-1 text-sm leading-relaxed text-black/70">{t('fields.contact.hint')}</p>
          <input
            id={`${id}-contact`}
            name="contact"
            type="text"
            className="field-input mt-2"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            maxLength={CONTACT_MAX + 20}
            autoComplete="off"
            disabled={busy}
            aria-invalid={errors.contact ? 'true' : undefined}
            aria-describedby={`${id}-contact-hint${errors.contact ? ` ${id}-contact-error` : ''}`}
            data-testid="field-contact"
          />
          {errors.contact && <p id={`${id}-contact-error`} className="field-error mt-1">{errors.contact}</p>}
        </div>

        {/* consent */}
        <div className="mt-6 rounded-(--radius-control) border border-black/15 bg-paper p-4">
          <p className="text-sm leading-relaxed text-black/80">{t('privacy.note')}</p>
          <p className="mt-2 t-label text-black/60">{t('privacy.reviewNote', { version: CONSENT_VERSION })}</p>
          <label htmlFor={`${id}-consent`} className="mt-4 flex min-h-11 cursor-pointer items-start gap-3">
            <input
              id={`${id}-consent`}
              name="consent"
              type="checkbox"
              className="field-check"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              required
              disabled={busy}
              aria-invalid={errors.consent ? 'true' : undefined}
              aria-describedby={errors.consent ? `${id}-consent-error` : undefined}
              data-testid="field-consent"
            />
            <span className="text-base font-semibold leading-relaxed">{t('privacy.consent')}</span>
          </label>
          {errors.consent && <p id={`${id}-consent-error`} className="field-error mt-2">{errors.consent}</p>}
        </div>

        {/* Turnstile mounts here when the form scrolls into view; unmounts with the form. */}
        <TurnstileSlot locale={locale} tokenRef={tokenRef} widgetRef={widgetRef} scriptFailedRef={scriptFailedRef} flushToken={flushToken} />

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <button type="submit" className="btn btn-primary" disabled={busy} data-testid="help-form-submit">
            <PaperPlaneTilt size={20} aria-hidden="true" />
            {busy ? t('submitting') : t('submit')}
          </button>
          <span className="text-sm text-black/70">{t('submitHint')}</span>
        </div>
      </form>
    </div>
  )
}
