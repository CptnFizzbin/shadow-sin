import { produce } from "immer"
import { useMemo } from "react"

import { useCharacterSheetContext } from "#/components/character/characterSheetProvider.tsx"
import { NuyenStore } from "#/components/finances/nuyen/nuyenStore.ts"
import { createSliceAtom } from "#/integrations/tanstackStore/atomUtils.ts"

export { NuyenStore } from "#/components/finances/nuyen/nuyenStore.ts"

export function useNuyenStore() {
  const store = useCharacterSheetContext()

  return useMemo((): NuyenStore => {
    const atom = createSliceAtom(
      store,
      (root) => root.nuyen,
      (root, nuyen) => produce(root, (draft) => { draft.nuyen = nuyen }),
    )
    return new NuyenStore(atom)
  }, [store])
}
