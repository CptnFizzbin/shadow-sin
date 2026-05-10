import { produce } from "immer"
import { useMemo } from "react"

import { useCharacterSheetContext } from "#/components/character/sheet/characterSheetProvider.tsx"
import { createSliceAtom } from "#/integrations/tanstackStore/atomUtils.ts"

import { AdeptPowersStore } from "./adeptPowersStore.ts"

export const useAdeptPowersStore = (): AdeptPowersStore => {
  const store = useCharacterSheetContext()

  return useMemo((): AdeptPowersStore => {
    const atom = createSliceAtom(
      store,
      (root) => root.powers,
      (root, powers) => produce(root, (draft) => { draft.powers = powers }),
    )

    return new AdeptPowersStore(atom)
  }, [store])
}
