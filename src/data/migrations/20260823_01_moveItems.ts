import type { CharacterMigration } from "#/data/characterMigration.ts"
import type { FeatureFlagsData } from "#/system/featureFlags/featureFlagsData.ts"
import type { ItemCatalog } from "#/system/items/itemUtils.ts"

type RunnerBefore = {
  gear?: ItemCatalog
  featureFlags?: FeatureFlagsData
}

type RunnerAfter = {
  _data_: {
    featureFlags: FeatureFlagsData
    items: ItemCatalog
  }
}

const migration: CharacterMigration<RunnerBefore & RunnerAfter> = {
  timestamp: "2026-08-23T13:14:21Z",
  up: (before) => {
    const { gear, featureFlags, ...rest } = before

    return {
      ...rest,

      _data_: {
        featureFlags: featureFlags ?? {},
        items: gear ?? {},
      },
    } satisfies RunnerAfter
  },
}

export default migration
