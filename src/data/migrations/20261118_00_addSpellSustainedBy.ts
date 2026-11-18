import { produce } from "immer"

import type { CharacterMigration } from "#/data/characterMigration.ts"

interface MigratingSpell {
  sustainedBy?: string | null
}

/**
 * Record every spell as sustained by its caster (`sustainedBy: null`), the only way a spell could be sustained before
 * a Sustaining Focus could hold one.
 */
const migration: CharacterMigration<{ spells?: MigratingSpell[] }> = {
  timestamp: "2026-11-18T13:00:00Z",
  up: (character) => {
    return produce(character, (draft) => {
      for (const spell of draft.spells ?? []) {
        spell.sustainedBy ??= null
      }
    })
  },
}

export default migration
