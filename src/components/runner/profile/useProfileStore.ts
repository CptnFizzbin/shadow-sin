import { produce } from "immer"
import { useMemo } from "react"

import { useRunnerDataContext } from "#/components/runner/sheet/runnerDataProvider.tsx"
import { createSliceAtom } from "#/integrations/tanstackStore/atomUtils.ts"

import { ProfileStore } from "./profileStore.ts"

/** @deprecated Use `useRunnerStoreSelector(selectProfile)` from `#/stores/runner/profile/profileSlice.selectors.ts` + `useRunnerStoreDispatch()` instead. */
export const useProfileStore = (): ProfileStore => {
  const store = useRunnerDataContext()

  return useMemo((): ProfileStore => {
    const atom = createSliceAtom(
      store,
      (root) => root.profile,
      (root, profile) => produce(root, (draft) => { draft.profile = profile }),
    )

    return new ProfileStore(atom)
  }, [store])
}
