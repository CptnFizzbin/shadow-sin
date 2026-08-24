import { produce } from "immer"

import type { CharacterMigration } from "#/data/characterMigration.ts"

interface Spell {
  threshold?: string
}

const migration: CharacterMigration<{
  spells?: Spell[]
}> = {
  timestamp: "2025-08-01T00:00:00Z",
  up: (character) => {
    return produce(character, (draft) => {
      draft.spells = (draft.spells ?? []).map((spell) => {
        spell.threshold ??= ""
        return spell
      })
    })
  },
}

export default migration
