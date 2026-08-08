import { produce } from "immer"

import type { CharacterMigration } from "#/data/characterMigration.ts"

const VERSION = 10

const migration: CharacterMigration<{ spirits?: Array<Record<string, unknown>> }> = {
  version: VERSION,
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
