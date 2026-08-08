import { produce } from "immer"

import type { CharacterMigration } from "#/data/characterMigration.ts"

const migration: CharacterMigration<{ sprites?: Array<Record<string, unknown>> }> = {
  id: "20260806",
  up: produce((draft) => {
    if (!Array.isArray(draft.sprites)) return
    for (const sprite of draft.sprites) {
      if (typeof sprite.damage === "undefined") {
        sprite.damage = { matrix: 0 }
      }
    }
  }),
}

export default migration
