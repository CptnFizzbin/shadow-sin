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
  id: "20260521",
  up: produce((draft) => {
    draft.karma ??= { current: 0, total: 0 }
    draft.karma.log ??= []
  }),
}

export default migration
