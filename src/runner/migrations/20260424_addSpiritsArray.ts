import { produce } from "immer"

import type { CharacterMigration } from "#/runner/characterMigration.ts"

const migration: CharacterMigration<{ spirits?: unknown[] }> = {
  id: "20260424",
  up: produce((draft) => {
    draft.spirits ??= []
  }),
}

export default migration
