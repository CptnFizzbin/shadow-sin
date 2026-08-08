import { produce } from "immer"

import type { CharacterMigration } from "#/data/characterMigration.ts"

const VERSION = 9

const migration: CharacterMigration<{ spirits?: unknown[] }> = {
  version: VERSION,
  up: (character) => {
    return produce(character, (draft) => {
      draft.spirits ??= []
    })
  },
}

export default migration
