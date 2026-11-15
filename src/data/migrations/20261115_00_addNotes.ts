import { produce } from "immer"

import type { CharacterMigration } from "#/data/characterMigration.ts"

/** Add a top-level `notes` string (free-form text on the Notes page), empty for every runner. */
const migration: CharacterMigration<{ notes?: string }> = {
  timestamp: "2026-11-15T18:06:00Z",
  up: (character) => {
    return produce(character, (draft) => {
      draft.notes ??= ""
    })
  },
}

export default migration
