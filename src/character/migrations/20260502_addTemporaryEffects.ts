import { produce } from "immer"

import type { CharacterMigration } from "#/character/characterMigration.ts"

const migration: CharacterMigration<{ temporaryEffects?: unknown[] }> = {
  id: "20260502",
  up: produce((draft) => {
    draft.temporaryEffects ??= []
  }),
}

export default migration
