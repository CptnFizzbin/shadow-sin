import { produce } from "immer"

import type { CharacterMigration } from "#/data/characterMigration.ts"
import { migrationAlreadyApplied } from "#/data/characterMigration.ts"

const VERSION = 2

interface Spell {
  threshold?: string
}

const migration: CharacterMigration<{
  spells?: Spell[]
}> = {
  version: VERSION,
  up: (character) => {
    if (migrationAlreadyApplied(character, VERSION)) return character as { spells?: Spell[] }

    return produce(character, (draft) => {
      draft.spells = (draft.spells ?? []).map((spell) => {
        spell.threshold ??= ""
        return spell
      })
    })
  },
}

export default migration
