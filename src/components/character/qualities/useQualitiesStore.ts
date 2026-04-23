import { produce } from "immer"
import { useMemo } from "react"

import { QualitiesStore } from "#/components/character/qualities/qualitiesStore.ts"
import { useCharacterSheetContext } from "#/components/character/sheet/characterSheetProvider.tsx"
import { createSliceAtom } from "#/integrations/tanstackStore/atomUtils.ts"

export const useQualitiesStore = (): QualitiesStore => {
  const store = useCharacterSheetContext()

  return useMemo((): QualitiesStore => {
    const atom = createSliceAtom(
      store,
      (root) => root.qualities,
      (root, qualities) => produce(root, (draft) => { draft.qualities = qualities }),
    )

    return new QualitiesStore(atom)
  }, [store])
}
