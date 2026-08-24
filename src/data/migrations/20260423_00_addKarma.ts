import { produce } from "immer"
import { z } from "zod"

import type { CharacterMigration } from "#/data/characterMigration.ts"

const migration: CharacterMigration<{
  karma?: number | {
    current?: number
    total?: number
  }
}> = {
  timestamp: "2026-04-23T00:00:00Z",
  up: (character) => {
    return produce(character, (draft) => {
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
    })
  },
}

export default migration
