import { produce } from "immer"
import { useMemo } from "react"

import { useRunnerDataContext } from "#/components/runner/sheet/runnerDataProvider.tsx"
import { createSliceAtom } from "#/integrations/tanstackStore/atomUtils.ts"
import { AttributeKey } from "#/system/attributeKey.ts"

import { EdgeStore } from "./edgeStore.ts"

export const useEdgeStore = () => {
  const sheetStore = useRunnerDataContext()

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
