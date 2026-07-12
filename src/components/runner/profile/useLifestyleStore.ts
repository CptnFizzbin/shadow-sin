import { useMemo } from "react"

import { useRunnerDataContext } from "#/components/runner/sheet/runnerDataProvider.tsx"
import { createSliceAtom } from "#/integrations/tanstackStore/atomUtils.ts"
import { LifestyleType } from "#/system/lifestyleType.ts"

import { LifestyleStore } from "./lifestyleStore.ts"

/** @deprecated Use `useRunnerStoreSelector(selectLifestyle)` from `#/stores/runner/profile/profileSlice.selectors.ts` + `useRunnerStoreDispatch()` instead. */
export const useLifestyleStore = (): LifestyleStore => {
  const store = useRunnerDataContext()

  return useMemo((): LifestyleStore => {
    const atom = createSliceAtom(
      store,
      (root) => root.profile.lifestyle ?? { quality: LifestyleType.Street, monthsPaid: 1 },
      (root, lifestyle) => ({
        ...root,
        profile: {
          ...root.profile,
          lifestyle,
        },
      }),
    )

    return new LifestyleStore(atom)
  }, [store])
}
