import { produce } from "immer"

import type { CharacterMigration } from "#/data/characterMigration.ts"

interface OldSinItem {
  itemType?: string
  rating?: unknown
  isReal?: unknown
}

/**
 * `SinData` retires its `rating: "real"` string-sentinel case (see #535) for an explicit `isReal`
 * flag: a SIN whose `rating` was the `"real"` sentinel becomes `{ isReal: true }` (dropping
 * `rating` entirely); any other rating value becomes `{ isReal: false, rating: <that value> }`.
 * Idempotent — a SIN already carrying `isReal` (this migration's own output) is left untouched.
 */
const migration: CharacterMigration<{ _data_?: { items?: Record<string, OldSinItem> } }> = {
  timestamp: "2026-08-30T09:00:00Z",
  up: (character) => {
    return produce(character, (draft) => {
      const items = draft._data_?.items
      if (!items) return

      for (const item of Object.values(items)) {
        if (item.itemType !== "sin") continue
        if ("isReal" in item) continue

        if (item.rating === "real") {
          delete item.rating
          item.isReal = true
        } else {
          item.isReal = false
        }
      }
    })
  },
}

export default migration
