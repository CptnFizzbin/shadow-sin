import { produce } from "immer"

import type { CharacterMigration } from "#/data/characterMigration.ts"
import type { UUID } from "#/lib/uuidUtils.ts"

const VERSION = 28

interface OldItem {
  parentId?: UUID
  childIds?: UUID[]
  items?: { parentId: UUID | null, childIds: UUID[] }
}

/**
 * Nests each item's `parentId`/`childIds` attachment fields under `items` (see
 * `docs/features/0015-entity-interface-decomposition.md`'s `EntityWithItems`), and backfills
 * `RunnerData`'s own always-degenerate `items` field — `RunnerData` implements `EntityWithItems`
 * too, but is never a child and never attaches to anything itself.
 */
const migration: CharacterMigration<{
  items?: { parentId: UUID | null, childIds: UUID[] }
  _data_?: { items?: Record<string, OldItem> }
}> = {
  version: VERSION,
  up: (character) => {
    return produce(character, (draft) => {
      draft.items ??= { parentId: null, childIds: [] }

      for (const item of Object.values(draft._data_?.items ?? {})) {
        const { parentId, childIds } = item
        item.items = { parentId: parentId ?? null, childIds: childIds ?? [] }
        delete item.parentId
        delete item.childIds
      }
    })
  },
}

export default migration
