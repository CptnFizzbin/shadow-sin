import type { UUID } from "node:crypto"

import { produce } from "immer"

import { StoreSlice } from "#/integrations/tanstackStore/storeSlice.ts"
import type { SpiritData } from "#/system/magic/spiritData.ts"

export type SpiritsStoreState = SpiritData[]

export class SpiritsStore extends StoreSlice<SpiritsStoreState> {
  save(spirit: SpiritData) {
    this.setState((state: SpiritsStoreState) =>
      produce(state, (draft) => {
        const index = draft.findIndex((s) => s.id === spirit.id)
        if (index >= 0) {
          draft[index] = spirit
        } else {
          draft.push(spirit)
        }
      }),
    )
  }

  remove(spiritId: UUID) {
    this.setState((state: SpiritsStoreState) => state.filter((s) => s.id !== spiritId))
  }
}
