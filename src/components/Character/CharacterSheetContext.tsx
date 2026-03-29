import type { Store } from "@tanstack/store"
import { createContext, useContext } from "react"

import type { CharacterSheet } from "#/lib/system/characterSheet.ts"

export const CharacterSheetContext =
  createContext<Store<CharacterSheet> | null>(null)

export const useCharacterSheetContext = (): Store<CharacterSheet> => {
  const store = useContext(CharacterSheetContext)

  if (!store) {
    throw new Error(
      "useCharacterStoreContext must be used within a CharacterStoreProvider",
    )
  }

  return store
}
