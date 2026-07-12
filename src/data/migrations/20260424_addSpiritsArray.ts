import { produce } from "immer"

<<<<<<<< HEAD:src/data/migrations/20260424_addSpiritsArray.ts
import type { CharacterMigration } from "#/data/characterMigration.ts"
========
import type { CharacterMigration } from "#/runner/characterMigration.ts"
>>>>>>>> shadowrun-4e:src/runner/migrations/20260424_addSpiritsArray.ts

const migration: CharacterMigration<{ spirits?: unknown[] }> = {
  id: "20260424",
  up: produce((draft) => {
    draft.spirits ??= []
  }),
}

export default migration
