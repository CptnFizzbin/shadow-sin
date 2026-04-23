import { produce } from "immer"
import { useMemo } from "react"

import { EdgeStore } from "#/components/character/quickPanel/edgeStore.ts"
import { useCharacterSheetContext } from "#/components/character/sheet/characterSheetProvider.tsx"
import { createSliceAtom } from "#/integrations/tanstackStore/atomUtils.ts"
import { AttributeKey } from "#/system/attributeKey.ts"

export const useEdgeStore = () => {
  const sheetStore = useCharacterSheetContext()

  return useMemo(() => {
    const sliceAtom = createSliceAtom(
      sheetStore,
      (sheet) => ({
        max: sheet.attributes[AttributeKey.edge],
        current: sheet.edge.current,
      }),
      (sheet, state) => produce(sheet, (draft) => {
        draft.attributes[AttributeKey.edge] = state.max
        draft.edge.current = state.current
      }),
    )

    return new EdgeStore(sliceAtom)
  }, [sheetStore])
}
