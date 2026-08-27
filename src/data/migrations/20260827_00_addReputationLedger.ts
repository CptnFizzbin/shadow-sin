import { produce } from "immer"

import type { CharacterMigration } from "#/data/characterMigration.ts"

/**
 * Add reputation.ledger (append-only audit trail of reputation changes).
 * Initialize with empty array for all runners.
 */
const migration: CharacterMigration<{ reputation?: { ledger?: unknown[] } }> = {
  timestamp: "2026-08-27T18:26:00Z",
  up: (character) => {
    return produce(character, (draft) => {
      // Idempotent: only add if not already present
      if (!draft.reputation) {
        draft.reputation = { ledger: [] }
      }
      if (!("ledger" in draft.reputation)) {
        draft.reputation.ledger = []
      }
    })
  },
}

export default migration
