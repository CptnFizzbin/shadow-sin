import { produce } from "immer"

import type { CharacterMigration } from "#/lib/storage/characters/characterMigration.ts"
import type { Character_V0_3_0 } from "#/lib/storage/characters/migrations/v030.ts"
import { VehicleCategory } from "#/lib/system/gear/vehicleData.ts"

interface GearItem_V0_3_0 {
  itemType?: string
  vehicleCategory?: string
}

interface Character_V0_3_0_WithGear extends Character_V0_3_0 {
  gear?: Record<string, GearItem_V0_3_0>
}

export interface Character_V0_4_0 extends Character_V0_3_0_WithGear {
  version: string
}

const migration: CharacterMigration<Character_V0_3_0_WithGear, Character_V0_4_0> = {
  version: "0.4.0",
  up: (character) =>
    produce(character, (draft) => {
      if (!draft.gear) return

      for (const item of Object.values(draft.gear)) {
        if (item.itemType === "vehicle" && !item.vehicleCategory) {
          item.vehicleCategory = VehicleCategory.vehicle
        }
      }
    }),
}

export default migration
