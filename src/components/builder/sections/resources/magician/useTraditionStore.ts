import { produce } from "immer"
import { useMemo } from "react"

import { useRunnerDataContext } from "#/components/runner/sheet/runnerDataProvider.tsx"
import { createSliceAtom } from "#/integrations/tanstackStore/atomUtils.ts"

import { TraditionStore } from "./traditionStore.ts"

/** @deprecated Use `useRunnerStoreSelector(selectTradition)` from `#/stores/runner/tradition/traditionSlice.selectors.ts` + `useRunnerStoreDispatch()` instead. */
export const useTraditionStore = (): TraditionStore => {
  const store = useRunnerDataContext()

  return useMemo((): TraditionStore => {
    const atom = createSliceAtom(
      store,
      (root) => root.tradition,
      (root, tradition) =>
        produce(root, (draft) => {
          draft.tradition = tradition
        }),
    )

    return new TraditionStore(atom)
  }, [store])
}
