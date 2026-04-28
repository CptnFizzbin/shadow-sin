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
      (root) => root.adeptPowers,
      (root, adeptPowers) => produce(root, (draft) => { draft.adeptPowers = adeptPowers }),
    )

    return new AdeptPowersStore(atom)
  }, [store])
}
