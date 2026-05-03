import { produce } from "immer"

import type { CharacterMigration } from "#/character/characterMigration.ts"

type OldSpell = Record<string, unknown> & {
  drainBaseType?: string
  drainBaseValue?: number
  drainValueMod?: number
}

const migration: CharacterMigration<{ spells?: OldSpell[] }> = {
  id: "20260503",
  up: produce((draft) => {
    if (!Array.isArray(draft.spells)) return
    for (const spell of draft.spells) {
      if (typeof spell.drain !== "undefined") continue
      const drainType = spell.drainBaseType ?? "Force"
      const drainValue = drainType === "Fixed"
        ? (spell.drainBaseValue ?? 0)
        : (spell.drainValueMod ?? 0)
      spell.drain = { type: drainType, value: drainValue }
      delete spell.drainBaseType
      delete spell.drainBaseValue
      delete spell.drainValueMod
    }
  }),
}

export default migration
