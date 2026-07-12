import { produce } from "immer"
import { z } from "zod"

<<<<<<<< HEAD:src/data/migrations/20260423_addKarma.ts
import type { CharacterMigration } from "#/data/characterMigration.ts"
========
import type { CharacterMigration } from "#/runner/characterMigration.ts"
>>>>>>>> shadowrun-4e:src/runner/migrations/20260423_addKarma.ts

const migration: CharacterMigration<{
  karma?: number | {
    current?: number
    total?: number
  }
}> = {
  id: "20260423",
  up: produce((draft) => {
    switch (typeof draft.karma) {
      case "number": {
        const karmaValue = draft.karma
        draft.karma = { current: karmaValue, total: karmaValue }
        break
      }
      case "object":
        draft.karma = z.object({
          current: z.number().default(0),
          total: z.number().default(0),
        }).parse(draft.karma)
        break
      default:
        draft.karma = { current: 0, total: 0 }
    }
  }),
}

export default migration
