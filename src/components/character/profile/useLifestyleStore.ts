import { useMemo } from "react"

import { useCharacterSheetContext } from "#/components/character/sheet/characterSheetProvider.tsx"
import { createSliceAtom } from "#/integrations/tanstackStore/atomUtils.ts"
import { LifestyleType } from "#/system/lifestyleType.ts"

import { LifestyleStore } from "./lifestyleStore.ts"

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
