import { produce } from "immer"

import type { CharacterMigration } from "#/data/characterMigration.ts"
import type { FeatureFlagsData } from "#/system/featureFlags/featureFlagsData.ts"

const migration: CharacterMigration<{
  featureFlags?: FeatureFlagsData
}> = {
  timestamp: "2026-05-17T00:00:00Z",
  up: (character) => {
    return produce(character, (draft) => {
      draft.featureFlags ??= {}
    })
  },
}

export default migration
