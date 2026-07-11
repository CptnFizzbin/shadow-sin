import { produce } from "immer"
import { useMemo } from "react"

import { useRunnerDataContext } from "#/components/runner/sheet/runnerDataProvider.tsx"
import { createSliceAtom } from "#/integrations/tanstackStore/atomUtils.ts"

import { NuyenStore } from "./nuyenStore.ts"

export { NuyenStore } from "#/components/runner/finances/nuyen/nuyenStore.ts"

/** @deprecated Use `useRunnerStoreSelector(selectNuyen)` from `#/stores/runner/nuyen/nuyenSlice.selectors.ts` + `useRunnerStoreDispatch()` instead. */
export function useNuyenStore() {
  const store = useRunnerDataContext()

  return useMemo((): NuyenStore => {
    const atom = createSliceAtom(
      store,
      (root) => root.nuyen,
      (root, nuyen) => produce(root, (draft) => { draft.nuyen = nuyen }),
    )
    return new NuyenStore(atom)
  }, [store])
}
