import { useMemo } from "react"

import { useCharacterSheetContext } from "#/components/character/sheet/characterSheetProvider.tsx"
import { createSliceAtom } from "#/integrations/tanstackStore/atomUtils.ts"

import { SpiritsStore } from "./spiritsStore.ts"

export function useSpiritsStore(): SpiritsStore {
  const store = useCharacterSheetContext()

  return useMemo(() => {
    return new SpiritsStore(createSliceAtom(
      store,
      (root) => root.spirits ?? [],
      (root, spirits) => ({ ...root, spirits }),
    ))
  }, [store])
}
