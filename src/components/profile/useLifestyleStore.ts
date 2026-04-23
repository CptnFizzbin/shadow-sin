import { useMemo } from "react"

import { useCharacterSheetContext } from "#/components/character/characterSheetProvider.tsx"
import { LifestyleStore } from "#/components/profile/lifestyleStore.ts"
import { createSliceAtom } from "#/integrations/tanstackStore/atomUtils.ts"
import { LifestyleType } from "#/system/lifestyleType.ts"

export const useLifestyleStore = (): LifestyleStore => {
  const store = useCharacterSheetContext()

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
