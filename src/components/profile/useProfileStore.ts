import { produce } from "immer"
import { useMemo } from "react"

import { useCharacterSheetContext } from "#/components/character/characterSheetProvider.tsx"
import { ProfileStore } from "#/components/profile/profileStore.ts"
import { createSliceAtom } from "#/integrations/tanstackStore/atomUtils.ts"

export const useProfileStore = (): ProfileStore => {
  const store = useCharacterSheetContext()

  return useMemo((): ProfileStore => {
    const atom = createSliceAtom(
      store,
      (root) => root.profile,
      (root, profile) => produce(root, (draft) => { draft.profile = profile }),
    )

    return new ProfileStore(atom)
  }, [store])
}
