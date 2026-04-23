import { useStore } from "@tanstack/react-store"
import { produce } from "immer"
import { useMemo } from "react"

import { useCharacterSheetContext } from "#/components/character/characterSheetProvider.tsx"
import { selectPassesCompleted } from "#/components/initiative/initiativePassSelectors.ts"
import { InitiativePassStore } from "#/components/initiative/initiativePassStore.ts"
import { createSliceAtom } from "#/integrations/tanstackStore/atomUtils.ts"

export { InitiativePassStore } from "#/components/initiative/initiativePassStore.ts"

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
  const passesCompleted = useStore(store, selectPassesCompleted)
  return useMemo(() => new Set(passesCompleted), [passesCompleted])
}
