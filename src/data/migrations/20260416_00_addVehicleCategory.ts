import { produce } from "immer"

import type { CharacterMigration } from "#/data/characterMigration.ts"
import { VehicleCategory } from "#/system/gear/vehicleData.ts"

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
