import { useStore } from "@tanstack/react-store"
import { produce } from "immer"
import { useMemo } from "react"

import { useCharacterSheetContext } from "#/components/character/sheet/characterSheetProvider.tsx"
import { selectPassesCompleted } from "#/components/system/initiative/initiativePassSelectors.ts"
import { InitiativePassStore } from "#/components/system/initiative/initiativePassStore.ts"
import { createSliceAtom } from "#/integrations/tanstackStore/atomUtils.ts"

export { InitiativePassStore } from "#/components/system/initiative/initiativePassStore.ts"

export const useInitiativePassStore = (): InitiativePassStore => {
  const sheetStore = useCharacterSheetContext()

  return useMemo(() => {
    const sliceAtom = createSliceAtom(
      sheetStore,
      (sheet) => ({
        passesCompleted: sheet.initiative?.passesCompleted ?? [],
        rolledScore: sheet.initiative?.rolledScore,
        goingFirst: sheet.initiative?.goingFirst,
      }),
      (sheet, state) =>
        produce(sheet, (draft) => {
          if (!draft.initiative) draft.initiative = { passesCompleted: [] }
          draft.initiative.passesCompleted = state.passesCompleted
          draft.initiative.rolledScore = state.rolledScore
          draft.initiative.goingFirst = state.goingFirst
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

export const useInitiativeRolledScore = (store: InitiativePassStore): number | undefined =>
  useStore(store, (state) => state.rolledScore)

export const useInitiativeGoingFirst = (store: InitiativePassStore): boolean =>
  useStore(store, (state) => state.goingFirst === true)
