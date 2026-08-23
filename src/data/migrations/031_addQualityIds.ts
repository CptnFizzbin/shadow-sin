import { produce } from "immer"

import type { CharacterMigration } from "#/data/characterMigration.ts"

const VERSION = 31

interface OldQuality {
  id?: string
}

/**
 * Backfills a fresh id onto any Quality missing one. `EntityWithQualitiesSchema` requires every
 * Quality to carry a `z.uuid()` `id` — the Viewer's header narrows the runner entity to
 * `isEntityWithQualities` on every render (see `DamageSelectors`), so a Quality without an id
 * fails that check and throws, crashing the whole sheet on load rather than just the Qualities
 * section. Runners created or hand-edited before Qualities were required to carry an id can still
 * have entries missing one.
 */
const migration: CharacterMigration<{ qualities?: OldQuality[] }> = {
  version: VERSION,
  up: (character) => {
    return produce(character, (draft) => {
      for (const quality of draft.qualities ?? []) {
        quality.id ??= crypto.randomUUID()
      }
    })
  },
}

export default migration
