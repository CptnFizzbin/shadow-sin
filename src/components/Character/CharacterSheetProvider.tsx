import { createStore, type Store } from "@tanstack/store"
import { createContext, type FC, type PropsWithChildren, useMemo } from "react"

import type { CharacterSheet } from "#/lib/system/types/characterSheet.ts"

export const CharacterSheetStoreContext =
  createContext<Store<CharacterSheet> | null>(null)

export interface CharacterSheetProviderProps extends PropsWithChildren {
  characterSheet: CharacterSheet
}

export const CharacterSheetProvider: FC<CharacterSheetProviderProps> = ({
  characterSheet,
  children,
}) => {
  const store = useMemo(() => {
    return createStore(characterSheet)
  }, [characterSheet])

  return (
    <CharacterSheetStoreContext.Provider value={store}>
      {children}
    </CharacterSheetStoreContext.Provider>
  )_
}
