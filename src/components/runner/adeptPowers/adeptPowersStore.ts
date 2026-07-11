import { StoreSlice } from "#/integrations/tanstackStore/storeSlice.ts"
import { addPower, powersSlice, removePower, savePower, updatePower } from "#/stores/runner/powers/powersSlice.ts"
import type { AdeptPowerData } from "#/system/powers/adeptPowerData.ts"
import type { RunnerData } from "#/system/runnerData.ts"

export type AdeptPowersStoreState = RunnerData["powers"]

export class AdeptPowersStore extends StoreSlice<AdeptPowersStoreState> {
  setState(stateOrUpdater: AdeptPowersStoreState | ((prev: AdeptPowersStoreState) => AdeptPowersStoreState)) {
    this.set(stateOrUpdater)
  }

  /** @deprecated Dispatch `addPower` from `#/stores/runner/powers/powersSlice.ts` via `useRunnerStoreDispatch()` instead. */
  add(power: AdeptPowerData): void {
    this.set((prev) => powersSlice.reducer(prev, addPower(power)))
  }

  /** @deprecated Dispatch `updatePower` from `#/stores/runner/powers/powersSlice.ts` via `useRunnerStoreDispatch()` instead. */
  update(power: AdeptPowerData): void {
    this.set((prev) => powersSlice.reducer(prev, updatePower(power)))
  }

  /** @deprecated Dispatch `removePower` from `#/stores/runner/powers/powersSlice.ts` via `useRunnerStoreDispatch()` instead. */
  remove(powerId: string): void {
    this.set((prev) => powersSlice.reducer(prev, removePower(powerId)))
  }

  /** @deprecated Dispatch `savePower` from `#/stores/runner/powers/powersSlice.ts` via `useRunnerStoreDispatch()` instead. */
  save(power: AdeptPowerData): void {
    this.set((prev) => powersSlice.reducer(prev, savePower(power)))
  }
}
