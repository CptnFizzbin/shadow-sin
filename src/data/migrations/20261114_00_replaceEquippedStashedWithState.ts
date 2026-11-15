import { produce } from "immer"

import type { CharacterMigration } from "#/data/characterMigration.ts"

interface MigratingItem {
  itemType?: string
  equipped?: boolean
  stashed?: boolean
  state?: string
  _state?: { equipOnUnstash?: boolean }
}

// Literal type lists rather than the live `itemStatesByType` table, so this migration keeps doing
// the same thing if that table changes later.
const equippableTypes = ["weapon", "firearm", "armor", "device", "other"]
const implantableTypes = ["implant"]

function migratedState(item: MigratingItem): string {
  if (item.stashed === true) return "stashed"
  if (item.equipped === true) {
    if (equippableTypes.includes(item.itemType ?? "")) return "equipped"
    if (implantableTypes.includes(item.itemType ?? "")) return "implanted"
  }
  return "available"
}

/**
 * Replace each Item's `equipped`/`stashed` booleans (and the `_state.equipOnUnstash` bookkeeping)
 * with a single `state`: Stashed if it was stashed, otherwise its type's active state (Equipped or
 * Implanted) if it was explicitly equipped, otherwise Available. Items that were never explicitly
 * equipped become Available, so any Game Effects they carried stop applying until re-equipped.
 */
const migration: CharacterMigration<{ _data_?: { items?: Record<string, MigratingItem> } }> = {
  timestamp: "2026-11-14T16:25:54Z",
  up: (character) => {
    return produce(character, (draft) => {
      for (const item of Object.values(draft._data_?.items ?? {})) {
        item.state ??= migratedState(item)
        delete item.equipped
        delete item.stashed
        delete item._state
      }
    })
  },
}

export default migration
