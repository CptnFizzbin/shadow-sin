import { produce } from "immer"
import { useMemo } from "react"

import { NuyenStore } from "#/components/character/finances/nuyen/nuyenStore.ts"
import { useCharacterSheetContext } from "#/components/character/sheet/characterSheetProvider.tsx"
import { createSliceAtom } from "#/integrations/tanstackStore/atomUtils.ts"

export { NuyenStore } from "#/components/character/finances/nuyen/nuyenStore.ts"

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
