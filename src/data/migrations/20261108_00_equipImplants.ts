import { produce } from "immer"

import type { CharacterMigration } from "#/data/characterMigration.ts"

interface MigratingItem {
  itemType?: string
  equipped?: boolean
}

/**
 * Mark every implant as equipped. The implant form saved new implants as unequipped with no way to
 * equip them, which switched off their Game Effects.
 */
const migration: CharacterMigration<{ _data_?: { items?: Record<string, MigratingItem> } }> = {
  timestamp: "2026-11-08T17:10:00Z",
  up: (character) => {
    return produce(character, (draft) => {
      for (const item of Object.values(draft._data_?.items ?? {})) {
        if (item.itemType !== "implant") continue
        item.equipped = true
      }
    })
  },
}

export default migration
