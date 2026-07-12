import { produce } from "immer"

<<<<<<<< HEAD:src/data/migrations/20250801_addSpellThreshold.ts
import type { CharacterMigration } from "#/data/characterMigration.ts"
========
import type { CharacterMigration } from "#/runner/characterMigration.ts"
>>>>>>>> shadowrun-4e:src/runner/migrations/20250801_addSpellThreshold.ts

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
