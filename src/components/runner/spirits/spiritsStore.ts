import type { UUID } from "node:crypto"

import { StoreSlice } from "#/integrations/tanstackStore/storeSlice.ts"
import { removeSpirit, saveSpirit, spiritsSlice } from "#/stores/runner/spirits/spiritsSlice.ts"
import type { SpiritData } from "#/system/magic/spiritData.ts"

export type SpiritsStoreState = SpiritData[]

export class SpiritsStore extends StoreSlice<SpiritsStoreState> {
  /** @deprecated Dispatch `saveSpirit` from `#/stores/runner/spirits/spiritsSlice.ts` via `useRunnerStoreDispatch()` instead. */
  save(spirit: SpiritData) {
    this.set((prev) => spiritsSlice.reducer(prev, saveSpirit(spirit)))
  }

  /** @deprecated Dispatch `removeSpirit` from `#/stores/runner/spirits/spiritsSlice.ts` via `useRunnerStoreDispatch()` instead. */
  remove(spiritId: UUID) {
    this.set((prev) => spiritsSlice.reducer(prev, removeSpirit(spiritId)))
  }
}
