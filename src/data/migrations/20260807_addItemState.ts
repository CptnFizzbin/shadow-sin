import { produce } from "immer"

import type { CharacterMigration } from "#/data/characterMigration.ts"

interface GearItem {
  id: string
  itemType: string
  equipped?: boolean
  stashed?: boolean
  _state?: {
    equipped?: boolean
    stashed?: boolean
  }
}

/**
 * Backfills `_state` — the gear reducer's internal equipped/stashed mirror, added in #388 — from
 * each item's existing top-level `equipped`/`stashed` values. Additive only: the top-level fields
 * remain the primary read/write surface (see `docs/adr/0006-item-state-scope.md`), so this never
 * deletes them, it only seeds `_state` so it's never stale relative to a pre-#388 item that hasn't
 * gone through the reducer's sync logic yet.
 */
const migration: CharacterMigration<{
  gear?: Record<string, GearItem>
}> = {
  id: "20260807",
  up: produce((draft) => {
    const gear = (draft.gear ??= {})

    for (const item of Object.values(gear)) {
      if (item.equipped === undefined && item.stashed === undefined) continue

      item._state ??= {}
      if (item.equipped !== undefined) item._state.equipped = item.equipped
      if (item.stashed !== undefined) item._state.stashed = item.stashed
    }
  }),
}

export default migration
