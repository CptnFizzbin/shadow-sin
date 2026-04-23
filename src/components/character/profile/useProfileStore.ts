import { produce } from "immer"
import { useMemo } from "react"

import { ProfileStore } from "#/components/character/profile/profileStore.ts"
import { useCharacterSheetContext } from "#/components/character/sheet/characterSheetProvider.tsx"
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
