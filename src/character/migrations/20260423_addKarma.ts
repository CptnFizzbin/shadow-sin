import { produce } from "immer"

import type { CharacterMigration } from "#/character/characterMigration.ts"

const migration: CharacterMigration<{
  karma?: {
    current?: number
    total?: number
  }
}> = {
  id: "20260423",
  up: produce((draft) => {
    draft.karma ??= { current: 0, total: 0 }
    draft.karma.current ??= 0
    draft.karma.total ??= 0
  }),
}

export default migration
