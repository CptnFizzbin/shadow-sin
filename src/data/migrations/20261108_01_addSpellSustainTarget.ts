import { produce } from "immer"

import type { CharacterMigration } from "#/data/characterMigration.ts"

interface MigratingSpell {
  sustained?: boolean
  sustainedOn?: string
}

/**
 * Record every currently sustained spell as sustained on its caster (`sustainedOn: "Self"`), the only target a
 * sustained spell could have before a Spell could be sustained on someone else.
 */
const migration: CharacterMigration<{ spells?: MigratingSpell[] }> = {
  timestamp: "2026-11-08T21:58:00Z",
  up: (character) => {
    return produce(character, (draft) => {
      for (const spell of draft.spells ?? []) {
        if (spell.sustained) spell.sustainedOn ??= "Self"
      }
    })
  },
}

export default migration
