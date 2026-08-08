import { produce } from "immer"

import type { CharacterMigration } from "#/data/characterMigration.ts"
import { migrationAlreadyApplied } from "#/data/characterMigration.ts"
import type { KarmaLedgerEntry } from "#/system/karma/karmaLedgerEntry.ts"

const VERSION = 17

const migration: CharacterMigration<{
  karma?: {
    current?: number
    total?: number
    log?: KarmaLedgerEntry[]
  }
}> = {
  version: VERSION,
  up: (character) => {
    if (migrationAlreadyApplied(character, VERSION)) {
      return character as {
        karma?: { current?: number, total?: number, log?: KarmaLedgerEntry[] }
      }
    }

    return produce(character, (draft) => {
      draft.karma ??= { current: 0, total: 0 }
      draft.karma.log ??= []
    })
  },
}

export default migration
