import { StoreSlice } from "#/integrations/tanstackStore/storeSlice.ts"
import { saveTradition } from "#/stores/runner/tradition/traditionSlice.actions.ts"
import { traditionReducer } from "#/stores/runner/tradition/traditionSlice.ts"
import type { TraditionData } from "#/system/magic/traditionData.ts"

export type TraditionStoreState = TraditionData | undefined

export class TraditionStore extends StoreSlice<TraditionStoreState> {
  /** @deprecated Dispatch `saveTradition` from `#/stores/runner/tradition/traditionSlice.actions.ts` via `useRunnerStoreDispatch()` instead. */
  save(tradition: TraditionData): void {
    this.set((prev) => traditionReducer(prev, saveTradition(tradition)))
  }
}
