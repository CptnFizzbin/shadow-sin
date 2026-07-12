import { produce } from "immer"

<<<<<<<< HEAD:src/data/migrations/20260419_removeVersionField.ts
import type { CharacterMigration } from "#/data/characterMigration.ts"
========
import type { CharacterMigration } from "#/runner/characterMigration.ts"
>>>>>>>> shadowrun-4e:src/runner/migrations/20260419_removeVersionField.ts

const migration: CharacterMigration<{
  version?: number
}> = {
  id: "20260419",
  up: produce((draft) => {
    delete draft.version
  }),
}

export default migration
