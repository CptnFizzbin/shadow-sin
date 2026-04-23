import { produce } from "immer"
import { useMemo } from "react"

import { useCharacterSheetContext } from "#/components/character/characterSheetProvider.tsx"
import { QualitiesStore } from "#/components/qualities/qualitiesStore.ts"
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
