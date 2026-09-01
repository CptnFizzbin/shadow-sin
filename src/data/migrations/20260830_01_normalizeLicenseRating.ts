import { produce } from "immer"

import type { CharacterMigration } from "#/data/characterMigration.ts"

interface OldLicenseItem {
  itemType?: string
  rating?: unknown
  isReal?: unknown
}

/**
 * `LicenseData` retires its `rating: "real"` string-sentinel case (see #535) for an explicit
 * `isReal` flag — same transform as `20260830_00_normalizeSinRating.ts`, for `LicenseData`
 * instead of `SinData`. Idempotent — a Licence already carrying `isReal` (this migration's own
 * output) is left untouched.
 */
const migration: CharacterMigration<{ _data_?: { items?: Record<string, OldLicenseItem> } }> = {
  timestamp: "2026-08-30T09:05:00Z",
  up: (character) => {
    return produce(character, (draft) => {
      const items = draft._data_?.items
      if (!items) return

      for (const item of Object.values(items)) {
        if (item.itemType !== "license") continue
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
