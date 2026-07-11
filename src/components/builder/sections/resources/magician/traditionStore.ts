import { StoreSlice } from "#/integrations/tanstackStore/storeSlice.ts"
import { saveTradition, traditionSlice } from "#/stores/runner/tradition/traditionSlice.ts"
import type { TraditionData } from "#/system/magic/traditionData.ts"

export type TraditionStoreState = TraditionData | undefined

export class TraditionStore extends StoreSlice<TraditionStoreState> {
  /** @deprecated Dispatch `saveTradition` from `#/stores/runner/tradition/traditionSlice.ts` via `useRunnerStoreDispatch()` instead. */
  save(tradition: TraditionData): void {
    this.set((prev) => traditionSlice.reducer(prev, saveTradition(tradition)))
  }
}
