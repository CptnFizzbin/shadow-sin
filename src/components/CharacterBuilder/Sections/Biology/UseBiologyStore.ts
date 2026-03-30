import type { BaseAtom } from "@tanstack/store"
import { createStore } from "@tanstack/store"
import { produce } from "immer"
import { useMemo } from "react"

import { useCharacterSheetContext } from "#/components/Character/CharacterSheetContext.tsx"
import type { CharacterSheet } from "#/lib/system/characterSheet.ts"

export type BiologyState = CharacterSheet["biology"]

export interface BiologyStore extends BaseAtom<BiologyState> {
  setState: (updater: (prev: BiologyState) => BiologyState) => void
}

export const useBiologyStore = (): BiologyStore => {
  const sheetStore = useCharacterSheetContext()

  return useMemo(() => {
    const biologyStore = createStore(() => sheetStore.state.biology)

    return {
      get: () => biologyStore.get(),
      subscribe: (listener) => biologyStore.subscribe(listener),
      setState: (updater) => {
        sheetStore.setState(produce((prev) => {
          prev.biology = updater(prev.biology)
        }))
      },
    }
  }, [sheetStore])
}
