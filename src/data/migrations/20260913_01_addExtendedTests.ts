import { produce } from "immer"

import type { CharacterMigration } from "#/data/characterMigration.ts"

/**
 * Add `extendedTests` (long-term Extended Tests tracked on the Notes page).
 * Initialize with an empty array for all runners.
 */
const migration: CharacterMigration<{ extendedTests?: unknown[] }> = {
  timestamp: "2026-09-13T18:23:00Z",
  up: (character) => {
    return produce(character, (draft) => {
      // Idempotent: only add if not already present
      if (!draft.extendedTests) {
        draft.extendedTests = []
      }
    })
  },
}

export default migration
