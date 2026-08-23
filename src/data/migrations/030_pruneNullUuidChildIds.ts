import { produce } from "immer"

import type { CharacterMigration } from "#/data/characterMigration.ts"

const VERSION = 30

const NULL_UUID = "00000000-0000-0000-0000-000000000000"

interface OldItem {
  items?: { parentId: string | null, childIds?: string[] }
}

/**
 * A form default bug (fixed alongside this migration) stamped every newly-created implant with
 * `items.childIds: [NULL_UUID]` — a placeholder that never corresponded to a real gear item.
 * Runners that added an implant while the bug was live carry that dangling reference in storage,
 * which crashes the Cyberware view when it resolves the phantom child id to `undefined`. Strips
 * `NULL_UUID` out of every item's `items.childIds`, leaving any real child references untouched.
 */
const migration: CharacterMigration<{ _data_?: { items?: Record<string, OldItem> } }> = {
  version: VERSION,
  up: (character) => {
    return produce(character, (draft) => {
      for (const item of Object.values(draft._data_?.items ?? {})) {
        if (!item.items?.childIds?.includes(NULL_UUID)) continue
        item.items.childIds = item.items.childIds.filter((childId) => childId !== NULL_UUID)
      }
    })
  },
}

export default migration
