import { produce } from "immer"

import type { CharacterMigration } from "#/data/characterMigration.ts"

const VERSION = 26

interface OldArmorGear {
  itemType?: string
  rating?: unknown
}

/**
 * `ArmorData.rating` has been deprecated since {@link ../024_normalizeArmorRating.ts} in favor of
 * the `ballistic`/`impact` fields, which are the values actually used everywhere armor rating
 * matters. This migration drops the now-unused field entirely.
 */
const migration: CharacterMigration<{ gear?: Record<string, OldArmorGear> }> = {
  version: VERSION,
  up: (character) => {
    return produce(character, (draft) => {
      if (!draft.gear) return

      for (const item of Object.values(draft.gear)) {
        if (item.itemType !== "armor") continue
        delete item.rating
      }
    })
  },
}

export default migration
