import { produce } from "immer"

import type { CharacterMigration } from "#/data/characterMigration.ts"

const migration: CharacterMigration<{
  version?: number
}> = {
  timestamp: "2026-04-19T00:00:00Z",
  up: (character) => {
    return produce(character, (draft) => {
      delete draft.version
    })
  },
}

export default migration
