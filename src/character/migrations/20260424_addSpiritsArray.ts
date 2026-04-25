import { produce } from "immer"

import type { CharacterMigration } from "#/character/characterMigration.ts"

const migration: CharacterMigration = {
  id: "20260424",
  up: produce((draft: any) => {
    draft.spirits ??= []
  }),
}

export default migration
