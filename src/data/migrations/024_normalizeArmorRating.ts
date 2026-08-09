import { produce } from "immer"

import type { CharacterMigration } from "#/data/characterMigration.ts"

const VERSION = 24

interface OldArmorGear {
  itemType?: string
  rating?: unknown
}

/**
 * `ArmorData.rating` narrows from `ItemData`'s inherited `number | string` down to plain
 * `Rating` (`number`) — Armor never used the string sentinel (`ArmorData`'s real stats are
 * `ballistic`/`impact`), so a string value only ever got there via the loosely-typed base field.
 * A numeric string ("4") converts to its number; anything else non-numeric or empty is dropped.
 */
const migration: CharacterMigration<{ gear?: Record<string, OldArmorGear> }> = {
  version: VERSION,
  up: (character) => {
    return produce(character, (draft) => {
      if (!draft.gear) return

      for (const item of Object.values(draft.gear)) {
        if (item.itemType !== "armor") continue
        if (typeof item.rating !== "string") continue

        const trimmed = item.rating.trim()
        const parsed = trimmed === "" ? NaN : Number(trimmed)
        if (Number.isFinite(parsed)) {
          item.rating = parsed
        } else {
          delete item.rating
        }
      }
    })
  },
}

export default migration
