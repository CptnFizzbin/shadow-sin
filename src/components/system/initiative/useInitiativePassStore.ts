import { useStore } from "@tanstack/react-store"
import { produce } from "immer"
import { useMemo } from "react"

import { useCharacterSheetContext } from "#/components/character/sheet/characterSheetProvider.tsx"
import { selectPassesCompleted } from "#/components/system/initiative/initiativePassSelectors.ts"
import type { InitiativePassState } from "#/components/system/initiative/initiativePassStore.ts"
import { InitiativePassStore } from "#/components/system/initiative/initiativePassStore.ts"
import { createSliceAtom } from "#/integrations/tanstackStore/atomUtils.ts"

export { InitiativePassStore } from "#/components/system/initiative/initiativePassStore.ts"

export const useInitiativePassStore = (): InitiativePassStore => {
  const sheetStore = useCharacterSheetContext()

  return useMemo(() => {
    const sliceAtom = createSliceAtom(
      sheetStore,
      (sheet): InitiativePassState => ({
        passesCompleted: sheet.initiative?.passesCompleted ?? [],
        rolledResults: sheet.initiative?.rolledResults,
        goingFirst: sheet.initiative?.goingFirst,
        extraPasses: sheet.initiative?.extraPasses ?? 0,
      }),
      (sheet, state) =>
        produce(sheet, (draft) => {
          if (!draft.initiative) draft.initiative = { passesCompleted: [] }
          draft.initiative.passesCompleted = state.passesCompleted
          draft.initiative.rolledResults = state.rolledResults
          draft.initiative.goingFirst = state.goingFirst
          draft.initiative.extraPasses = state.extraPasses
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

export const useInitiativeRolledResults = (store: InitiativePassStore): number[] | undefined =>
  useStore(store, (state) => state.rolledResults)

export const useInitiativeGoingFirst = (store: InitiativePassStore): boolean =>
  useStore(store, (state) => state.goingFirst === true)

export const useInitiativeExtraPasses = (store: InitiativePassStore): number =>
  useStore(store, (state) => state.extraPasses)
