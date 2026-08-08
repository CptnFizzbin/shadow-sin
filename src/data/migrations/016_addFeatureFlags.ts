import { produce } from "immer"

import type { CharacterMigration } from "#/data/characterMigration.ts"
import { migrationAlreadyApplied } from "#/data/characterMigration.ts"
import type { FeatureFlagsData } from "#/system/featureFlags/featureFlagsData.ts"

const VERSION = 16

const migration: CharacterMigration<{
  featureFlags?: FeatureFlagsData
}> = {
  version: VERSION,
  up: (character) => {
    if (migrationAlreadyApplied(character, VERSION)) {
      return character as { featureFlags?: FeatureFlagsData }
    }

    return produce(character, (draft) => {
      draft.featureFlags ??= {}
    })
  },
}

export default migration
