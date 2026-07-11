import { StoreSlice } from "#/integrations/tanstackStore/storeSlice.ts"
import { addQuality, qualitiesSlice, removeQuality, updateQuality } from "#/stores/runner/qualities/qualitiesSlice.ts"
import type { QualityData } from "#/system/qualityData.ts"
import type { RunnerData } from "#/system/runnerData.ts"

export type QualitiesStoreState = RunnerData["qualities"]

export class QualitiesStore extends StoreSlice<QualitiesStoreState> {
  setState(updater: (prev: QualitiesStoreState) => QualitiesStoreState): void {
    this.set(updater)
  }

  /** @deprecated Dispatch `addQuality` from `#/stores/runner/qualities/qualitiesSlice.ts` via `useRunnerStoreDispatch()` instead. */
  add(quality: QualityData): void {
    this.set((prev) => qualitiesSlice.reducer(prev, addQuality(quality)))
  }

  /** @deprecated Dispatch `updateQuality` from `#/stores/runner/qualities/qualitiesSlice.ts` via `useRunnerStoreDispatch()` instead. */
  update(quality: QualityData): void {
    this.set((prev) => qualitiesSlice.reducer(prev, updateQuality(quality)))
  }

  /** @deprecated Dispatch `removeQuality` from `#/stores/runner/qualities/qualitiesSlice.ts` via `useRunnerStoreDispatch()` instead. */
  remove(qualityName: string): void {
    this.set((prev) => qualitiesSlice.reducer(prev, removeQuality(qualityName)))
  }
}
