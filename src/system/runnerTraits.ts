import type { FeatureFlagsData } from "./featureFlags/featureFlagsData.ts"
import type { ItemCatalog } from "./items/itemUtils.ts"

export interface RunnerWithData {
  _data_: {
    /**
     * Per-runner feature flags. Optional so pre-migration runners remain
     * structurally valid; the migration backfills this on next load.
     */
    featureFlags: FeatureFlagsData

    items: ItemCatalog
  }
}
