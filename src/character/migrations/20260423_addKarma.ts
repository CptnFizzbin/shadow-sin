import { produce } from "immer"

import type { CharacterMigration } from "#/character/characterMigration.ts"

const migration: CharacterMigration<{
  karma?: number | {
    current?: number
    total?: number
  }
}> = {
  id: "20260423",
  up: produce((draft) => {
    if (typeof draft.karma === "number") {
      const karmaValue = draft.karma
      draft.karma = { current: karmaValue, total: karmaValue }
    } else {
      draft.karma ??= { current: 0, total: 0 }
      draft.karma.current ??= 0
      draft.karma.total ??= 0
    }
  }),
}

export default migration
