import { StoreSlice } from "#/integrations/tanstackStore/storeSlice.ts"
import type { TraditionData } from "#/system/magic/traditionData.ts"

export type TraditionStoreState = TraditionData | undefined

export class TraditionStore extends StoreSlice<TraditionStoreState> {
  save(tradition: TraditionData): void {
    this.set(tradition)
  }
}
