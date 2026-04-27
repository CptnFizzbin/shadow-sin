import { useStore } from "@tanstack/react-store"
import { produce } from "immer"
import { useMemo } from "react"

import { useCharacterSheetContext } from "#/components/character/sheet/characterSheetProvider.tsx"
import type { ManualStatusState } from "#/components/system/manualStatus/manualStatusStore.ts"
import { ManualStatusStore } from "#/components/system/manualStatus/manualStatusStore.ts"
import { createSliceAtom } from "#/integrations/tanstackStore/atomUtils.ts"
import type { ManualStatus } from "#/system/manualStatus.ts"

export const useManualStatusStore = (): ManualStatusStore => {
  const sheetStore = useCharacterSheetContext()

  return useMemo(() => {
    const sliceAtom = createSliceAtom(
      sheetStore,
      (sheet): ManualStatusState => ({
        entries: sheet.manualStatuses ?? [],
      }),
      (sheet, state) =>
        produce(sheet, (draft) => {
          draft.manualStatuses = state.entries
        }),
    )

    return new ManualStatusStore(sliceAtom)
  }, [sheetStore])
}

export const useManualStatusEntries = (store: ManualStatusStore): ManualStatus[] =>
  useStore(store, (state) => state.entries)
