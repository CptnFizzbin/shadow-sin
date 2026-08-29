import { produce } from "immer"

import type { CharacterMigration } from "#/data/characterMigration.ts"
import type { JsonObject } from "#/lib/jsonUtils.ts"

const migration: CharacterMigration<{ spirits?: Array<JsonObject> }> = {
  timestamp: "2026-04-25T00:00:00Z",
  up: (character) => {
    return produce(character, (draft) => {
      if (!Array.isArray(draft.spirits)) return
      for (const spirit of draft.spirits) {
        if (typeof spirit.damage === "undefined") {
          spirit.damage = { physical: 0, stun: 0 }
        }
      }
    })
  },
}

export default migration
