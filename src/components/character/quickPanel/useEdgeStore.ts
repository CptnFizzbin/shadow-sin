import { produce } from "immer"
import { useMemo } from "react"

import { useCharacterSheetContext } from "#/components/character/characterSheetProvider.tsx"
import type { Recipe } from "#/integrations/tanstackStore/atomUtils.ts"
import { createSliceAtom } from "#/integrations/tanstackStore/atomUtils.ts"
import { StoreSlice } from "#/integrations/tanstackStore/storeSlice.ts"
import { AttributeKey } from "#/system/attributeKey.ts"

interface EdgeStoreState {
  max: number
  current: number
}

export class EdgeStore extends StoreSlice<EdgeStoreState> {
  setCurrent(valueOrUpdater: number | Recipe<number>): void {
    this.set(
      produce((state) => {
        const next = valueOrUpdater instanceof Function ? valueOrUpdater(state.current) : valueOrUpdater
        state.current = Math.max(0, Math.min(next, state.max))
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
