import { createContext, useContext } from "react"

import { OutOfContextError } from "#/lib/errors/outOfContextError.ts"

import type { CharacterSheetStore } from "./characterSheetStore.ts"

export const CharacterSheetContext = createContext<CharacterSheetStore | null>(null)

export const useCharacterSheetContext = (): CharacterSheetStore => {
  const store = useContext(CharacterSheetContext)

  if (!store) {
    throw new OutOfContextError("useCharacterSheetContext", "CharacterSheetProvider")
  }

  return store
}
