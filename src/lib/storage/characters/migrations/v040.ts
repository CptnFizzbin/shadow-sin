import { produce } from "immer"

import type { BaseCharacterMetadata, CharacterMigration } from "#/lib/storage/characters/characterMigration.ts"
import type { Character_V0_3_0 } from "#/lib/storage/characters/migrations/v030.ts"
import { VehicleCategory } from "#/lib/system/gear/vehicleData.ts"

export interface Character_V0_4_0 extends BaseCharacterMetadata {
  version: string
}

const migration: CharacterMigration<Character_V0_3_0, Character_V0_4_0> = {
  version: "0.4.0",
  up: (character) =>
    produce(character as unknown as Character_V0_4_0, (draft) => {
      const gear = (draft as unknown as { gear?: Record<string, { itemType?: string, vehicleCategory?: string }> }).gear
      if (!gear) return

      for (const item of Object.values(gear)) {
        if (item.itemType === "vehicle" && !item.vehicleCategory) {
          item.vehicleCategory = VehicleCategory.vehicle
        }
      }
    }),
}

export default migration
