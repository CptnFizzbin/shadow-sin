import { produce } from "immer"

import type { CharacterMigration } from "#/character/characterMigration.ts"
import { VehicleCategory } from "#/system/gear/vehicleData.ts"

interface GearItem {
  itemType?: string
  vehicleCategory?: string
}

const migration: CharacterMigration<{
  gear?: Record<string, GearItem>
}> = {
  id: "20260416",
  up: produce((character) => {
    if (!character.gear) return

    for (const item of Object.values(character.gear)) {
      if (item.itemType === "vehicle" && !item.vehicleCategory) {
        item.vehicleCategory = VehicleCategory.vehicle
      }
    }
  }),
}

export default migration
