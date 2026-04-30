import { useSelector } from "@tanstack/react-store"
import { produce } from "immer"
import { useMemo } from "react"

import { useCharacterSheetContext } from "#/components/character/sheet/characterSheetProvider.tsx"
import { createSliceAtom } from "#/integrations/tanstackStore/atomUtils.ts"

import {
  selectExtraPasses,
  selectGoingFirst,
  selectPassesCompleted,
  selectRolledResults,
} from "./initiativePassSelectors.ts"
import type { InitiativePassState } from "./initiativePassStore.ts"
import { InitiativePassStore } from "./initiativePassStore.ts"

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

export function useInitiativePassSelector<T>(
  store: InitiativePassStore,
  selector: (state: InitiativePassState) => T,
): T {
  return useSelector(store, selector)
}

export const useInitiativePassesCompleted = (
  store: InitiativePassStore,
): ReadonlySet<number> => {
  const passesCompleted = useInitiativePassSelector(store, selectPassesCompleted)
  return useMemo(() => new Set(passesCompleted), [passesCompleted])
}

export const useInitiativeRolledResults = (store: InitiativePassStore): number[] | undefined =>
  useInitiativePassSelector(store, selectRolledResults)

export const useInitiativeGoingFirst = (store: InitiativePassStore): boolean =>
  useInitiativePassSelector(store, selectGoingFirst)

export const useInitiativeExtraPasses = (store: InitiativePassStore): number =>
  useInitiativePassSelector(store, selectExtraPasses)
