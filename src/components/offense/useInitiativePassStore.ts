import { useStore } from "@tanstack/react-store"
import { produce } from "immer"
import { useMemo } from "react"

import { useCharacterSheetContext } from "#/components/character/characterSheetProvider.tsx"
import { createSliceAtom } from "#/integrations/tanstackStore/atomUtils.ts"
import { StoreSlice } from "#/integrations/tanstackStore/storeSlice.ts"

interface InitiativePassState {
  passesCompleted: number[]
}

export class InitiativePassStore extends StoreSlice<InitiativePassState> {
  togglePass(passIndex: number): void {
    this.set(
      produce((state) => {
        const completed = new Set(state.passesCompleted)
        if (completed.has(passIndex)) {
          completed.delete(passIndex)
        } else {
          completed.add(passIndex)
        }
        state.passesCompleted = Array.from(completed)
      }),
    )
  }

  resetPasses(): void {
    this.set(
      produce((state) => {
        state.passesCompleted = []
      }),
    )
  }
}

export const useInitiativePassStore = (): InitiativePassStore => {
  const sheetStore = useCharacterSheetContext()

  return useMemo(() => {
    const sliceAtom = createSliceAtom(
      sheetStore,
      (sheet) => ({
        passesCompleted: sheet.initiative?.passesCompleted ?? [],
      }),
      (sheet, state) =>
        produce(sheet, (draft) => {
          if (!draft.initiative) draft.initiative = { passesCompleted: [] }
          draft.initiative.passesCompleted = state.passesCompleted
        }),
    )

    return new InitiativePassStore(sliceAtom)
  }, [sheetStore])
}

export const useInitiativePassesCompleted = (
  store: InitiativePassStore,
): ReadonlySet<number> => {
  const passesCompleted = useStore(store, (state) => state.passesCompleted)
  return useMemo(() => new Set(passesCompleted), [passesCompleted])
}
