import { produce } from "immer"

import type { CharacterMigration } from "#/character/characterMigration.ts"
import type { FeatureFlagsData } from "#/system/featureFlags/featureFlagsData.ts"

const migration: CharacterMigration<{
  featureFlags?: FeatureFlagsData
}> = {
  id: "20260517",
  up: produce((draft) => {
    draft.featureFlags ??= {}
  }),
}

export default migration
