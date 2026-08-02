import { produce } from "immer"

import type { CharacterMigration } from "#/data/characterMigration.ts"

const migration: CharacterMigration<{ agents?: unknown[] }> = {
  id: "20260802",
  up: produce((draft) => {
    draft.agents ??= []
  }),
}

export default migration
