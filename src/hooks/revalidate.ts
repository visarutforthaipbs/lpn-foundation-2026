import { revalidatePath } from 'next/cache'
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from 'payload'
import { routing } from '@/i18n/routing'

// Only revalidate when running inside the Next.js runtime. During CLI scripts
// (seed, migrate, generate:types) NEXT_RUNTIME is undefined and revalidatePath
// would throw outside a request context.
const inNext = () => Boolean(process.env.NEXT_RUNTIME)

const safe = (path: string, type?: 'layout' | 'page') => {
  try {
    revalidatePath(path, type)
  } catch {
    /* outside request context — ignore */
  }
}

export const revalidatePost: CollectionAfterChangeHook = ({ doc }) => {
  if (!inNext()) return doc
  for (const locale of routing.locales) {
    safe(`/${locale}/blog`)
    safe(`/${locale}`)
    if (doc?.slug) safe(`/${locale}/post/${doc.slug}`)
  }
  return doc
}

export const revalidatePostDelete: CollectionAfterDeleteHook = ({ doc }) => {
  if (!inNext()) return doc
  for (const locale of routing.locales) {
    safe(`/${locale}/blog`)
    if (doc?.slug) safe(`/${locale}/post/${doc.slug}`)
  }
  return doc
}

export const revalidatePage: CollectionAfterChangeHook = ({ doc }) => {
  if (!inNext()) return doc
  for (const locale of routing.locales) {
    if (doc?.slug === 'home') safe(`/${locale}`)
    else if (doc?.slug) safe(`/${locale}/${doc.slug}`)
  }
  return doc
}

// Header/footer appear on every page → revalidate the whole layout.
export const revalidateLayout: GlobalAfterChangeHook = ({ doc }) => {
  if (inNext()) safe('/', 'layout')
  return doc
}
