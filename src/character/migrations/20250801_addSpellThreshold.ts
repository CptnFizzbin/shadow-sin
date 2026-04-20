import { produce } from "immer"

import type { CharacterMigration } from "../characterMigration.ts"

interface Spell {
  threshold?: string
}

const migration: CharacterMigration<{
  spells?: Spell[]
}> = {
  id: "20250801",
  up: (character) =>
    produce(character, (draft) => {
      draft.spells = (draft.spells ?? []).map((spell) => {
        spell.threshold ??= ""
        return spell
      })
    }),
}

export default migration
