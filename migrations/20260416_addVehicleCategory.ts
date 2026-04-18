import { produce } from "immer"

import type { CharacterMigration } from "#/lib/storage/characters/characterMigration.ts"
import { VehicleCategory } from "#/lib/system/gear/vehicleData.ts"

interface GearItem {
  itemType?: string
  vehicleCategory?: string
}

const migration: CharacterMigration<{
  gear?: Record<string, GearItem>
}> = {
  id: "20260416",
  checkApplied: (character) => {
    const characterData = character as { gear?: Record<string, GearItem> }
    return Object.values(characterData.gear ?? {}).every(
      (item) => item.itemType !== "vehicle" || item.vehicleCategory !== undefined,
    )
  },
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
