import { produce } from "immer"
import { useMemo } from "react"

import { useRunnerDataContext } from "#/components/runner/sheet/runnerDataProvider.tsx"
import { createSliceAtom } from "#/integrations/tanstackStore/atomUtils.ts"

import { QualitiesStore } from "./qualitiesStore.ts"

/** @deprecated Use `useRunnerStoreSelector(selectQualities)` + `useRunnerStoreDispatch()` from `#/stores/runner/qualities/qualitiesSlice.ts` instead. */
export const useQualitiesStore = (): QualitiesStore => {
  const store = useRunnerDataContext()

  return useMemo((): QualitiesStore => {
    const atom = createSliceAtom(
      store,
      (root) => root.qualities,
      (root, qualities) => produce(root, (draft) => { draft.qualities = qualities }),
    )

    return new QualitiesStore(atom)
  }, [store])
}
