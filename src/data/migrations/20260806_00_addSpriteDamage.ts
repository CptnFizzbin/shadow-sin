import { produce } from "immer"

import type { CharacterMigration } from "#/data/characterMigration.ts"

const migration: CharacterMigration<{ sprites?: Array<Record<string, unknown>> }> = {
  timestamp: "2026-08-06T00:00:00Z",
  up: (character) => {
    return produce(character, (draft) => {
      if (!Array.isArray(draft.sprites)) return
      for (const sprite of draft.sprites) {
        if (typeof sprite.damage === "undefined") {
          sprite.damage = { matrix: 0 }
        }
      }
    })
  },
}

export default migration
