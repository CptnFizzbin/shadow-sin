import { produce } from "immer"

import type { CharacterMigration } from "#/data/characterMigration.ts"

interface MigratingItem {
  itemType?: string
  programType?: string
  attributes?: Record<string, number>
  damage?: Record<string, number>
}

/**
 * Give every Agent an `attributes` bag and a Matrix damage track. The Program form could save a
 * Program typed as an Agent without either, which stopped the Runner from loading.
 */
const migration: CharacterMigration<{ _data_?: { items?: Record<string, MigratingItem> } }> = {
  timestamp: "2026-10-30T12:15:00Z",
  up: (character) => {
    return produce(character, (draft) => {
      for (const item of Object.values(draft._data_?.items ?? {})) {
        if (item.itemType !== "program" || item.programType !== "agent") continue
        item.attributes ??= {}
        item.damage ??= {}
        item.damage.matrix ??= 0
      }
    })
  },
}

export default migration
