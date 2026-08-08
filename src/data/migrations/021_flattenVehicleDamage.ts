import { produce } from "immer"

import type { CharacterMigration } from "#/data/characterMigration.ts"
import { migrationAlreadyApplied } from "#/data/characterMigration.ts"

const VERSION = 21

interface OldVehicleGear {
  itemType?: string
  damage?: {
    physical?: unknown
  }
}

const migration: CharacterMigration<{ gear?: Record<string, OldVehicleGear> }> = {
  version: VERSION,
  up: (character) => {
    if (migrationAlreadyApplied(character, VERSION)) {
      return character as { gear?: Record<string, OldVehicleGear> }
    }

    return produce(character, (draft) => {
      if (!draft.gear) return

      for (const item of Object.values(draft.gear)) {
        if (item.itemType !== "vehicle") continue

        const physical = item.damage?.physical
        if (physical && typeof physical === "object") {
          const current = (physical as { current?: unknown }).current
          item.damage = { physical: typeof current === "number" ? current : 0 }
        }
      }
    })
  },
}

export default migration
