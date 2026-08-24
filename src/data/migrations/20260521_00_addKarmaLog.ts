import { produce } from "immer"

import type { CharacterMigration } from "#/data/characterMigration.ts"
import type { KarmaLedgerEntry } from "#/system/karma/karmaLedgerEntry.ts"

const migration: CharacterMigration<{
  karma?: {
    current?: number
    total?: number
    log?: KarmaLedgerEntry[]
  }
}> = {
  timestamp: "2026-05-21T00:00:00Z",
  up: (character) => {
    return produce(character, (draft) => {
      draft.karma ??= { current: 0, total: 0 }
      draft.karma.log ??= []
    })
  },
}

export default migration
