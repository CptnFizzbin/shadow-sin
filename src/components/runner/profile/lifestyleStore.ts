import { StoreSlice } from "#/integrations/tanstackStore/storeSlice.ts"
import { LifestyleType } from "#/system/lifestyleType.ts"
import type { RunnerData } from "#/system/runnerData.ts"

export type LifestyleStoreState = NonNullable<RunnerData["profile"]["lifestyle"]>

export class LifestyleStore extends StoreSlice<LifestyleStoreState> {
  setState(stateOrUpdater: LifestyleStoreState | ((prev: LifestyleStoreState) => LifestyleStoreState)) {
    this.set(stateOrUpdater)
  }

  setQuality(quality: LifestyleType): void {
    this.set((prev) => ({ ...(prev ?? { quality, monthsPaid: 1 }), quality }))
  }

  setMonthsPaid(months: number): void {
    this.set((prev) => ({ ...(prev ?? { quality: LifestyleType.Street, monthsPaid: months }), monthsPaid: months }))
  }
}
