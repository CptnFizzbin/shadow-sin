import { produce } from "immer"

import { VehicleCategory } from "#data/items/vehicleData.ts"
import type { CharacterMigration } from "#data/migrations/characterMigration.ts"

interface GearItem {
  itemType?: string
  vehicleCategory?: string
}

const migration: CharacterMigration<{
  gear?: Record<string, GearItem>
}> = {
  timestamp: "2026-04-16T00:00:00Z",
  up: (character) => {
    return produce(character, (draft) => {
      if (!draft.gear) return

      for (const item of Object.values(draft.gear)) {
        if (item.itemType === "vehicle" && !item.vehicleCategory) {
          item.vehicleCategory = VehicleCategory.vehicle
        }
      }
    })
  },
}

export default migration
