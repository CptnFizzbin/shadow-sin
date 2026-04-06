import { produce } from "immer"
import { useMemo } from "react"

import { useCharacterSheetContext } from "#/components/character/characterSheetProvider.tsx"
import { createSliceAtom } from "#/integrations/tanstackStore/atomUtils.ts"
import { StoreSlice } from "#/integrations/tanstackStore/storeSlice.ts"
import type { TraditionData } from "#/lib/system/magic/traditionData.ts"

export type TraditionStoreState = TraditionData | undefined

export class TraditionStore extends StoreSlice<TraditionStoreState> {
  save(tradition: TraditionData): void {
    this.set(tradition)
  }
}

export const useTraditionStore = (): TraditionStore => {
  const store = useCharacterSheetContext()

  return useMemo((): TraditionStore => {
    const atom = createSliceAtom(
      store,
      (root) => root.tradition,
      (root, tradition) =>
        produce(root, (draft) => {
          draft.tradition = tradition
        }),
    )

    return new TraditionStore(atom)
  }, [store])
}
