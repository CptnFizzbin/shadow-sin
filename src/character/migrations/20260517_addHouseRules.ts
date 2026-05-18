import { produce } from "immer"

import type { CharacterMigration } from "#/character/characterMigration.ts"
import type { HouseRules } from "#/system/houseRules.ts"
import { defaultHouseRules } from "#/system/houseRules.ts"

const migration: CharacterMigration<{
  houseRules?: HouseRules
}> = {
  id: "20260517",
  up: produce((draft) => {
    draft.houseRules ??= { ...defaultHouseRules }
  }),
}

export default migration
