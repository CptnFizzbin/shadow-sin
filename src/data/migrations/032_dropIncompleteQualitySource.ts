import { produce } from "immer"

import type { CharacterMigration } from "#/data/characterMigration.ts"

const VERSION = 32

interface OldQuality {
  source?: { book?: string, page?: number }
}

/**
 * Drops a Quality's `source` when it's missing `book` or `page`. `EntityWithQualitiesSchema`
 * requires a present `source` to fully satisfy `SourceDataSchema` (both fields, `page` a positive
 * integer) — the Viewer's header narrows the runner entity to `isEntityWithQualities` on every
 * render (see `DamageSelectors`), so one Quality with an incomplete source fails that check and
 * throws, crashing the whole sheet on load rather than just the Qualities section. Runners
 * hand-edited to cite a source without a page number can still carry one.
 */
const migration: CharacterMigration<{ qualities?: OldQuality[] }> = {
  version: VERSION,
  up: (character) => {
    return produce(character, (draft) => {
      for (const quality of draft.qualities ?? []) {
        if (quality.source && (quality.source.book === undefined || quality.source.page === undefined)) {
          delete quality.source
        }
      }
    })
  },
}

export default migration
