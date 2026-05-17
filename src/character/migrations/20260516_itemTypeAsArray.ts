import { produce } from "immer"

import type { CharacterMigration } from "#/character/characterMigration.ts"

interface GearItem {
  itemType?: string | string[]
}

const migration: CharacterMigration<{
  gear?: Record<string, GearItem>
}> = {
  id: "20260516",
  up: produce((character) => {
    if (!character.gear) return

    for (const item of Object.values(character.gear)) {
      if (typeof item.itemType === "string") {
        item.itemType = [item.itemType]
      }
    }
  }),
}

export default migration
