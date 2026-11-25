import { produce } from "immer"

import type { FeatureFlagsData } from "#/data/featureFlags/featureFlagsData.ts"
import type { CharacterMigration } from "#/data/migrations/characterMigration.ts"

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
