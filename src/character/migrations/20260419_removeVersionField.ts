import { produce } from "immer"

import type { CharacterMigration } from "../characterMigration.ts"

const migration: CharacterMigration<{
  version?: number
}> = {
  id: "20260419",
  up: produce((draft) => {
    delete draft.version
  }),
}

export default migration
