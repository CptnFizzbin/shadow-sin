import { produce } from "immer"

import type { CharacterMigration } from "#/data/characterMigration.ts"

const VERSION = 27

interface OldRunner {
  name?: string
  profile?: {
    alias?: string
    name?: string
  }
}

/**
 * Backfills the root `name` field (see `docs/features/0015-entity-interface-decomposition.md`'s
 * `EntityData` shape) from `profile.alias || profile.name` — the same mirror `nameReducer`
 * (`runnerStore.reducer.ts`) keeps in sync going forward.
 */
const migration: CharacterMigration<OldRunner> = {
  version: VERSION,
  up: (character) => {
    return produce(character, (draft) => {
      draft.name ??= draft.profile?.alias || draft.profile?.name || ""
    })
  },
}

export default migration
