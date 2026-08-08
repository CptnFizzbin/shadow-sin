import { produce } from "immer"

import type { CharacterMigration } from "#/data/characterMigration.ts"

const VERSION = 19

const migration: CharacterMigration<{
  initiateGrade?: number
  submersionGrade?: number
}> = {
  version: VERSION,
  up: (character) => {
    return produce(character, (draft) => {
      draft.initiateGrade ??= 0
      draft.submersionGrade ??= 0
    })
  },
}

export default migration
