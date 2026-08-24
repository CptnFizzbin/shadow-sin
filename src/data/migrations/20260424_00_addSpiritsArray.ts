import { produce } from "immer"

import type { CharacterMigration } from "#/data/characterMigration.ts"

const migration: CharacterMigration<{ spirits?: unknown[] }> = {
  timestamp: "2026-04-24T00:00:00Z",
  up: (character) => {
    return produce(character, (draft) => {
      draft.spirits ??= []
    })
  },
}

export default migration
