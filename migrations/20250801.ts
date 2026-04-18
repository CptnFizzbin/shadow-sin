import { produce } from "immer"

import type { CharacterMigration } from "#/lib/storage/characters/characterMigration.ts"

interface Spell {
  theshold?: string
}

const migration: CharacterMigration<{
  spells?: Spell[]
}> = {
  id: "20250801",
  checkApplied: (character) => {
    const chars = character as { spells?: Array<Record<string, unknown>> }
    return (chars.spells ?? []).every((spell) => "theshold" in spell)
  },
  up: (character) =>
    produce(character, (draft) => {
      draft.spells = (draft.spells ?? []).map((spell) => {
        spell.theshold ??= ""
        return spell
      })
    }),
}

export default migration
