import { StoreSlice } from "#/integrations/tanstackStore/storeSlice.ts"
import { profileSlice, setLifestyleMonthsPaid, setLifestyleQuality } from "#/stores/runner/profile/profileSlice.ts"
import { LifestyleType } from "#/system/lifestyleType.ts"
import type { RunnerData } from "#/system/runnerData.ts"

export type LifestyleStoreState = NonNullable<RunnerData["profile"]["lifestyle"]>

export class LifestyleStore extends StoreSlice<LifestyleStoreState> {
  setState(stateOrUpdater: LifestyleStoreState | ((prev: LifestyleStoreState) => LifestyleStoreState)) {
    this.set(stateOrUpdater)
  }

  /** @deprecated Dispatch `setLifestyleQuality` from `#/stores/runner/profile/profileSlice.ts` (a `profile`-slice action) via `useRunnerStoreDispatch()` instead. */
  setQuality(quality: LifestyleType): void {
    this.set((prev) => {
      const profile = profileSlice.reducer({ lifestyle: prev } as RunnerData["profile"], setLifestyleQuality(quality))
      return profile.lifestyle ?? { quality, monthsPaid: 1 }
    })
  }

  /** @deprecated Dispatch `setLifestyleMonthsPaid` from `#/stores/runner/profile/profileSlice.ts` (a `profile`-slice action) via `useRunnerStoreDispatch()` instead. */
  setMonthsPaid(months: number): void {
    this.set((prev) => {
      const profile = profileSlice.reducer({ lifestyle: prev } as RunnerData["profile"], setLifestyleMonthsPaid(months))
      return profile.lifestyle ?? { quality: LifestyleType.Street, monthsPaid: months }
    })
  }
}
