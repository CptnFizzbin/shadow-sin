import { produce } from "immer"
import { useMemo } from "react"

import { useCharacterSheetContext } from "#/components/character/characterSheetProvider.tsx"
import { createSliceAtom } from "#/integrations/tanstackStore/atomUtils.ts"
import { StoreSlice } from "#/integrations/tanstackStore/storeSlice.ts"
import { AttributeKey } from "#/lib/system/attributeKey.ts"

interface EdgeStoreState {
  max: number
  current: number
}

export class EdgeStore extends StoreSlice<EdgeStoreState> {
  setCurrent(value: number): void {
    this.set(
      produce((state) => {
        state.current = Math.max(0, Math.min(value, state.max))
      }),
    )
  }

  restore(): void {
    this.set(
      produce((state) => {
        state.current = state.max
      }),
    )
  }

  burn(): void {
    this.set(
      produce((state) => {
        state.max = Math.max(1, state.max - 1)
        state.current = 0
      }),
    )
  }
}

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
