import { produce } from "immer"

import type { CharacterMigration } from "#/data/characterMigration.ts"

const migration: CharacterMigration<{
  initiateGrade?: number
  submersionGrade?: number
}> = {
  timestamp: "2026-07-16T00:00:00Z",
  up: (character) => {
    return produce(character, (draft) => {
      draft.initiateGrade ??= 0
      draft.submersionGrade ??= 0
    })
  },
}

export default migration
