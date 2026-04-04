import { useStore } from "@tanstack/react-store"
import type { FC, PropsWithChildren } from "react"
import { createContext, useContext } from "react"

import type { CharacterSheetStore } from "#/components/Character/character-sheet-store.ts"
import type { CharacterSheet } from "#/lib/system/character-sheet.ts"

export const CharacterSheetContext = createContext<CharacterSheetStore | null>(null)

export interface CharacterSheetProviderProps extends PropsWithChildren {
  store: CharacterSheetStore
}

export const CharacterSheetProvider: FC<CharacterSheetProviderProps> = ({
  store,
  children,
}) => {
  return (
    <CharacterSheetContext.Provider value={store}>
      {children}
    </CharacterSheetContext.Provider>
  )
}

type CharacterDataSelector<TData> = (state: CharacterSheet) => TData

export function useCharacterSheet<TData>(selector: CharacterDataSelector<TData>) {
  const store = useCharacterSheetContext()
  return useStore(store, selector)
}

export const useCharacterSheetContext = (): CharacterSheetStore => {
  const store = useContext(CharacterSheetContext)

  if (!store) {
    throw new Error(
      "useCharacterSheetContext must be used within a CharacterSheetProvider",
    )
  }

  return store
}
