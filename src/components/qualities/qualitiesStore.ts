import { StoreSlice } from "#/integrations/tanstackStore/storeSlice.ts"
import type { CharacterSheet } from "#/system/characterSheet.ts"
import type { QualityData } from "#/system/qualityData.ts"

export type QualitiesStoreState = CharacterSheet["qualities"]

export class QualitiesStore extends StoreSlice<QualitiesStoreState> {
  setState(updater: (prev: QualitiesStoreState) => QualitiesStoreState): void {
    this.set(updater)
  }

  add(quality: QualityData): void {
    this.set((prev) => [...prev, quality])
  }

  update(quality: QualityData): void {
    this.set((prev) => prev.map((q) => q.name === quality.name ? quality : q))
  }

  remove(qualityName: string): void {
    this.set((prev) => prev.filter((q) => q.name !== qualityName))
  }
}
