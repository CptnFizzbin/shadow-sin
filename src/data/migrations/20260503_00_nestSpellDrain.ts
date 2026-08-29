import { produce } from "immer"

import type { CharacterMigration } from "#/data/characterMigration.ts"
import type { JsonObject } from "#/lib/jsonUtils.ts"

type OldSpell = JsonObject & {
  drainBaseType?: string
  drainBaseValue?: number
  drainValueMod?: number
}

const migration: CharacterMigration<{ spells?: OldSpell[] }> = {
  timestamp: "2026-05-03T00:00:00Z",
  up: (character) => {
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
