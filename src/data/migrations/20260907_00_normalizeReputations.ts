import { produce } from "immer"

import type { CharacterMigration } from "#/data/characterMigration.ts"
import type { UUID } from "#/lib/uuidUtils.ts"
import { uuid } from "#/lib/uuidUtils.ts"
import { ReputationStatType } from "#/system/reputation/reputationLedgerEntry.ts"

interface Character {
  profile?: {
    streetCred?: number
    notoriety?: number
    publicAwarenessModifier?: number
  }

  reputation?: {
    ledger: Array<{
      id: UUID
      stat: ReputationStatType
      timestamp: string
      amount: number
      description: string
    }>
  }
}

/**
 * Backfills `reputation.ledger` (initializing it to `[]` first if reputation or the ledger is
 * missing entirely) from the legacy `profile.streetCred`, `profile.notoriety`, and
 * `profile.publicAwarenessModifier` fields, each becoming a single "Legacy import" ledger entry
 * (skipped when the legacy value is 0 or unset). Idempotent — a character whose ledger already
 * has at least one entry is left untouched, so this only ever runs once per character.
 */
const migration: CharacterMigration<Character> = {
  timestamp: "2026-09-07T00:00:00Z",
  up: (character) => {
    return produce(character, (draft) => {
      draft.reputation ||= { ledger: [] }
      const ledger = draft.reputation.ledger ||= []
      if (ledger.length >= 1) return

      const {
        streetCred = 0,
        notoriety = 0,
        publicAwarenessModifier = 0,
      } = draft.profile || {}

      if (streetCred >= 1) {
        ledger.push({
          id: uuid.v7(),
          stat: ReputationStatType.streetCred,
          timestamp: new Date().toISOString(),
          amount: streetCred,
          description: "Legacy import",
        })
      }

      if (notoriety >= 1) {
        ledger.push({
          id: uuid.v7(),
          stat: ReputationStatType.notoriety,
          timestamp: new Date().toISOString(),
          amount: notoriety,
          description: "Legacy import",
        })
      }

      if (publicAwarenessModifier >= 1) {
        ledger.push({
          id: uuid.v7(),
          stat: ReputationStatType.publicAwareness,
          timestamp: new Date().toISOString(),
          amount: publicAwarenessModifier,
          description: "Legacy import",
        })
      }
    })
  },
}

export default migration
