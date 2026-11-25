import { produce } from "immer"

import type { CharacterMigration } from "#/data/characterMigration.ts"

interface OldRunner {
  name?: string
  profile?: {
    alias?: string
    name?: string
  }
}

/**
 * Backfills the root `name` field (see `docs/features/0015-entity-interface-decomposition.md`'s
 * `EntityBase` shape) from `profile.alias || profile.name` — the same mirror `nameReducer`
 * (`runnerStore.reducer.ts`) keeps in sync going forward.
 */
const migration: CharacterMigration<OldRunner> = {
  timestamp: "2026-08-23T00:02:36Z",
  up: (character) => {
    return produce(character, (draft) => {
      draft.name ??= draft.profile?.alias || draft.profile?.name || ""
    })
  },
}

export default migration
