import { produce } from "immer"

import type { Recipe } from "#/integrations/tanstackStore/atomUtils.ts"
import { StoreSlice } from "#/integrations/tanstackStore/storeSlice.ts"
import { NumberUtils } from "#/lib/numberUtils.ts"

export interface EdgeStoreState {
  max: number
  current: number
}

export class EdgeStore extends StoreSlice<EdgeStoreState> {
  setCurrent(valueOrUpdater: number | Recipe<number>): void {
    this.set(
      produce((state) => {
        const next = valueOrUpdater instanceof Function ? valueOrUpdater(state.current) : valueOrUpdater
        state.current = NumberUtils.clamp(next, { min: 0, max: state.max })
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
