import { produce } from "immer"

import type { Recipe } from "#/integrations/tanstackStore/atomUtils.ts"
import { StoreSlice } from "#/integrations/tanstackStore/storeSlice.ts"
import { setDamage } from "#/stores/runner/damage/damageSlice.actions.ts"
import { damageReducer } from "#/stores/runner/damage/damageSlice.ts"
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
  /** @deprecated Dispatch `setDamage` from `#/stores/runner/damage/damageSlice.actions.ts` via `useRunnerStoreDispatch()` instead. */
  setDamage(track: DamageTrackKey, valueOrUpdater: number | Recipe<number>): void {
    this.set(
      produce((state) => {
        const next =
          typeof valueOrUpdater === "function"
            ? valueOrUpdater(state[track].current)
            : valueOrUpdater

        const rawDamage = { physical: state.physical.current, stun: state.stun.current, matrix: state.matrix.current }
        const nextRawDamage = damageReducer(rawDamage, setDamage({ track, value: next }))
        state[track].current = nextRawDamage[track]
      }),
    )
  }
}
