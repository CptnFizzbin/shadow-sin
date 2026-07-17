import { produce } from "immer"

import type { CharacterMigration } from "#/data/characterMigration.ts"

const migration: CharacterMigration<{
  initiateGrade?: number
  submersionGrade?: number
}> = {
  id: "20260716",
  up: produce((draft) => {
    draft.initiateGrade ??= 0
    draft.submersionGrade ??= 0
  }),
}

export default migration
