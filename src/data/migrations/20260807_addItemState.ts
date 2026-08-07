import { produce } from "immer"

import type { CharacterMigration } from "#/data/characterMigration.ts"

interface GearItem {
  id: string
  itemType: string
  equipped?: boolean
  stashed?: boolean
  _state?: {
    equipped?: boolean
    stashed?: boolean
  }
}

const migration: CharacterMigration<{
  gear?: Record<string, GearItem>
}> = {
  id: "20260807",
  up: produce((draft) => {
    const gear = (draft.gear ??= {})

    for (const item of Object.values(gear)) {
      if (item.equipped === undefined && item.stashed === undefined) continue

      item._state ??= {}
      if (item.equipped !== undefined) {
        item._state.equipped = item.equipped
        delete item.equipped
      }
      if (item.stashed !== undefined) {
        item._state.stashed = item.stashed
        delete item.stashed
      }
    }
  }),
}

export default migration
