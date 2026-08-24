import { produce } from "immer"

import type { CharacterMigration } from "#/data/characterMigration.ts"

interface OldVehicleGear {
  itemType?: string
  damage?: {
    physical?: unknown
  }
}

const migration: CharacterMigration<{ gear?: Record<string, OldVehicleGear> }> = {
  timestamp: "2026-08-07T00:00:00Z",
  up: (character) => {
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
