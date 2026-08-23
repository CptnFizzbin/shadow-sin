import type { CharacterMigration } from "#/data/characterMigration.ts"
import type { FeatureFlagsData } from "#/system/featureFlags/featureFlagsData.ts"
import type { ItemCatalog } from "#/system/items/itemUtils.ts"

const VERSION = 28

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
  version: VERSION,
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
