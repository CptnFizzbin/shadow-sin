import { useMemo } from "react"

import { useRunnerDataContext } from "#/components/runner/sheet/runnerDataProvider.tsx"
import { createSliceAtom } from "#/integrations/tanstackStore/atomUtils.ts"

import { BiologyStore } from "./biologyStore.ts"

/** @deprecated Use `useRunnerStoreSelector(selectBiology)` from `#/stores/runner/biology/biologySlice.selectors.ts` instead. Note: metatype/awakening changes go through `sheet.setState(produce(...))` directly today since they also touch `attributes`/`qualities` atomically — there's no dedicated write action to switch to yet. */
export const useBiologyStore = (): BiologyStore => {
  const sheetStore = useRunnerDataContext()

  return useMemo(() => {
    return new BiologyStore(createSliceAtom(
      sheetStore,
      (sheet) => sheet.biology,
      (sheet, biology) => ({ ...sheet, biology }),
    ))
  }, [sheetStore])
}
