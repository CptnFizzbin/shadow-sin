import { produce } from "immer"

import type { CharacterMigration } from "#/data/characterMigration.ts"
import { migrationAlreadyApplied } from "#/data/characterMigration.ts"

const VERSION = 7

const migration: CharacterMigration<{
  version?: number
}> = {
  version: VERSION,
  up: (character) => {
    if (migrationAlreadyApplied(character, VERSION)) return character as { version?: number }

    return produce(character, (draft) => {
      delete draft.version
    })
  },
}

export default migration
