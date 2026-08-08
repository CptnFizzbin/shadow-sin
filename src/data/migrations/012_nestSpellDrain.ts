import { produce } from "immer"

import type { CharacterMigration } from "#/data/characterMigration.ts"
import { migrationAlreadyApplied } from "#/data/characterMigration.ts"

const VERSION = 12

type OldSpell = Record<string, unknown> & {
  drainBaseType?: string
  drainBaseValue?: number
  drainValueMod?: number
}

const migration: CharacterMigration<{ spells?: OldSpell[] }> = {
  version: VERSION,
  up: (character) => {
    if (migrationAlreadyApplied(character, VERSION)) return character as { spells?: OldSpell[] }

    return produce(character, (draft) => {
      if (!Array.isArray(draft.spells)) return

      for (const spell of draft.spells) {
        if (typeof spell.drain !== "undefined") continue

        const drainType = spell.drainBaseType ?? "Force"
        const drainValue = (spell.drainBaseValue ?? 0) + (spell.drainValueMod ?? 0)

        spell.drain = { type: drainType, value: drainValue }

        delete spell.drainBaseType
        delete spell.drainBaseValue
        delete spell.drainValueMod
      }
    })
  },
}

export default migration
