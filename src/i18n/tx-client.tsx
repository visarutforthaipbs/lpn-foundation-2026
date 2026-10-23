'use client'

import { createContext, useCallback, useContext, type ReactNode } from 'react'
import { translateDeep, type Dict } from './tx-core'

export { fmt } from './tx-core'

const TxContext = createContext<Dict>({})

/** Server parents pass `draftDict(locale)` (empty for en/th) to client components that use `useTx`. */
export function TxProvider({ dict, children }: { dict: Dict; children: ReactNode }) {
  return <TxContext.Provider value={dict}>{children}</TxContext.Provider>
}

/** Client twin of `tx` from src/i18n/tx.ts — same call shape: tx(locale, thValue, enValue). */
export function useTx() {
  const dict = useContext(TxContext)
  return useCallback(
    <T,>(locale: string, thValue: T, enValue: T): T => {
      if (locale === 'th') return thValue
      if (locale === 'en') return enValue
      return translateDeep(dict, enValue)
    },
    [dict],
  )
}
