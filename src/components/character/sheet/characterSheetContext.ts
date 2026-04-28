import { createContext, useContext } from "react"

import type { CharacterSheetStore } from "#/components/character/sheet/characterSheetStore.ts"

export const CharacterSheetContext = createContext<CharacterSheetStore | null>(null)

export const useCharacterSheetContext = (): CharacterSheetStore => {
  const store = useContext(CharacterSheetContext)

  if (!store) {
    throw new Error(
      "useCharacterSheetContext must be used within a CharacterSheetProvider",
    )
  }

  return store
}
