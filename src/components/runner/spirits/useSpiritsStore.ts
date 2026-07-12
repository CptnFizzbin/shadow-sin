import { useMemo } from "react"

import { useRunnerDataContext } from "#/components/runner/sheet/runnerDataProvider.tsx"
import { createSliceAtom } from "#/integrations/tanstackStore/atomUtils.ts"

import { SpiritsStore } from "./spiritsStore.ts"

/** @deprecated Use `useRunnerStoreSelector(selectSpirits)` from `#/stores/runner/spirits/spiritsSlice.selectors.ts` + `useRunnerStoreDispatch()` instead. */
export function useSpiritsStore(): SpiritsStore {
  const store = useRunnerDataContext()

  return useMemo(() => {
    return new SpiritsStore(createSliceAtom(
      store,
      (root) => root.spirits ?? [],
      (root, spirits) => ({ ...root, spirits }),
    ))
  }, [store])
}
