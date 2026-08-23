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

/**
 * The runner's item catalog (`RunnerData._data_.items`). `_data_` is generalized internal
 * storage — sibling to `_meta_` — and isn't meant to be reached into directly; call sites that
 * want the item catalog go through this instead.
 */
export function getItemCatalog(runner: RunnerWithData): ItemCatalog {
  return runner._data_.items
}
