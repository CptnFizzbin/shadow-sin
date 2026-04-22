import { produce } from "immer"

import type { Recipe } from "#/integrations/tanstackStore/atomUtils.ts"
import { StoreSlice } from "#/integrations/tanstackStore/storeSlice.ts"
import type { DamageTrackKey } from "#/system/damageTrackKey.ts"

export interface DamageTrackState {
  max: number
  current: number
  woundInterval: number
}

export interface DamageStoreState {
  physical: DamageTrackState
  stun: DamageTrackState
  matrix: DamageTrackState
}

export class DamageStore extends StoreSlice<DamageStoreState> {
  setDamage(track: DamageTrackKey, valueOrUpdater: number | Recipe<number>): void {
    this.set(
      produce((state) => {
        const next =
          typeof valueOrUpdater === "function"
            ? valueOrUpdater(state[track].current)
            : valueOrUpdater
        state[track].current = Math.max(0, next)
      }),
    )
  }
}
