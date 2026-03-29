import type { Store } from "@tanstack/store"
import { useContext } from "react"

import { CharacterSheetContext } from "#/components/Character/CharacterSheetProvider.tsx"
import type { CharacterSheet } from "#/lib/system/characterSheet.ts"

export const useCharacterSheetContext = (): Store<CharacterSheet> => {
  const store = useContext(CharacterSheetContext)

  if (!store) {
    throw new Error(
      "useCharacterStoreContext must be used within a CharacterStoreProvider",
    )
  }

  return store
}
