import { produce } from "immer"

<<<<<<<< HEAD:src/data/migrations/20260517_addFeatureFlags.ts
import type { CharacterMigration } from "#/data/characterMigration.ts"
========
import type { CharacterMigration } from "#/runner/characterMigration.ts"
>>>>>>>> shadowrun-4e:src/runner/migrations/20260517_addFeatureFlags.ts
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
