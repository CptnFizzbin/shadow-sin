import { useStore } from "@tanstack/react-store"
import { produce } from "immer"
import { useMemo } from "react"

import { useCharacterSheetContext } from "#/components/character/sheet/characterSheetProvider.tsx"
import { createSliceAtom } from "#/integrations/tanstackStore/atomUtils.ts"

import { selectPassesCompleted } from "./initiativePassSelectors.ts"
import { InitiativePassStore } from "./initiativePassStore.ts"

export { InitiativePassStore } from "#/components/system/initiative/initiativePassStore.ts"

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
