import { produce } from "immer"

import type { CharacterMigration } from "#/data/characterMigration.ts"

const VERSION = 28

const NULL_UUID = "00000000-0000-0000-0000-000000000000"

interface OldGear {
  itemType?: string
  childIds?: string[]
}

/**
 * A form default bug (fixed alongside this migration) stamped every newly-created implant with
 * `childIds: [NULL_UUID]` — a placeholder that never corresponded to a real gear item. Runners
 * that added an implant while the bug was live carry that dangling reference in storage, which
 * crashes the Cyberware view when it resolves the phantom child id to `undefined`. Strips
 * `NULL_UUID` out of every item's `childIds`, leaving any real child references untouched.
 */
const migration: CharacterMigration<{ gear?: Record<string, OldGear> }> = {
  version: VERSION,
  up: (character) => {
    return produce(character, (draft) => {
      if (!draft.gear) return

      for (const item of Object.values(draft.gear)) {
        if (!item.childIds?.includes(NULL_UUID)) continue
        item.childIds = item.childIds.filter((childId) => childId !== NULL_UUID)
      }
    })
  },
}

export default migration
