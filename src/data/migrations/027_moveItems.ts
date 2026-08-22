import type { CharacterMigration } from "#/data/characterMigration.ts"
import type { FeatureFlagsData } from "#/system/featureFlags/featureFlagsData.ts"
import type { ItemCatalog } from "#/system/items/itemUtils.ts"

const VERSION = 27

type RunnerBefore = {
  gear: ItemCatalog
  featureFlags: FeatureFlagsData
}

type RunnerAfter = {
  gear: ItemCatalog
  featureFlags: FeatureFlagsData

  _data_: {
    featureFlags: FeatureFlagsData
    items: ItemCatalog
  }
}

const migration: CharacterMigration<RunnerBefore & RunnerAfter> = {
  version: VERSION,
  up: (before) => {
    return {
      ...before,
      gear: before.gear ?? {},
      featureFlags: before.featureFlags ?? {},

      _data_: {
        featureFlags: before.featureFlags ?? {},
        items: before.gear ?? {},
      },
    } satisfies RunnerAfter
  },
}

export default migration
