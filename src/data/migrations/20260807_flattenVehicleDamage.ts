import { produce } from "immer"

import type { CharacterMigration } from "#/data/characterMigration.ts"

interface OldVehicleGear {
  itemType?: string
  damage?: {
    physical?: unknown
  }
}

const migration: CharacterMigration<{ gear?: Record<string, OldVehicleGear> }> = {
  id: "20260807",
  up: produce((draft) => {
    if (!draft.gear) return

    for (const item of Object.values(draft.gear)) {
      if (item.itemType !== "vehicle") continue

      const physical = item.damage?.physical
      // Old shape was `{ current, max }`, with max always redundant (derivable from `body`).
      // A flat number means this item is already in the new shape — leave it alone.
      if (physical && typeof physical === "object") {
        const current = (physical as { current?: unknown }).current
        item.damage = { physical: typeof current === "number" ? current : 0 }
      }
    }
  }),
}

export default migration
