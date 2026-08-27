import type { UUID } from "#/lib/uuidUtils.ts"

/**
 * Which reputation stat a ledger entry affects.
 */
export type ReputationStatType = "streetCred" | "notoriety" | "publicAwarenessModifier"

/**
 * The source that produced a reputation ledger entry.
 *
 * - `manual` — entered by player via the Adjust Reputation dialog
 */
export type ReputationLedgerSource = "manual"

/**
 * One immutable, append-only audit-trail entry for a reputation change.
 *
 * Stored on `RunnerData.reputation.ledger`. Entries are never edited or removed —
 * corrections happen via counter-entries (e.g. adding a negative value to reverse
 * a prior positive entry).
 *
 * The displayed reputation value for a stat is calculated as:
 * `profile[stat] + sum of all ledger entries affecting that stat`
 */
export interface ReputationLedgerEntry {
  id: UUID
  /** Which reputation stat this entry affects. */
  stat: ReputationStatType
  /** ISO 8601 timestamp of when the entry was written. */
  timestamp: string
  /** Signed amount: negative for decreases, positive for increases. */
  amount: number
  /** Human-friendly summary, e.g. `"Successful run"`. */
  description: string
  /** Source that wrote this entry. */
  source: ReputationLedgerSource
}
