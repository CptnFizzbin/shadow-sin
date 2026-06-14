import type { UUID } from "node:crypto"

import type { ImprovementEntry } from "./improvements/improvementEntry.ts"

/**
 * The source that produced a karma ledger entry.
 *
 * - `addKarma` — positive entry written by the Add Karma dialog
 * - `spendKarma` — negative entry written by `applyImprovements` (one per improvement)
 * - `undo` — refund entry produced by post-Save undo (reserved for v2; unused in v1)
 */
export type KarmaLedgerSource = "addKarma" | "spendKarma" | "undo"

/**
 * One immutable, append-only audit-trail entry for a karma earn or spend.
 *
 * Stored on `CharacterSheet.karma.log`. Entries are never edited or removed —
 * corrections happen via counter-entries (e.g. a post-Save `undo` writes a
 * positive refund entry pointing back to the original via `undoes`).
 */
export interface KarmaLedgerEntry {
  id: UUID
  /** ISO 8601 timestamp of when the entry was written. */
  timestamp: string
  /** Signed amount: negative for spends, positive for earns and refunds. */
  amount: number
  /** Human-friendly summary, e.g. `"Raised AGI 4 → 5"`. */
  description: string
  source: KarmaLedgerSource
  /** Present when `source === "spendKarma"`. Enables future undo / export / replay. */
  improvement?: ImprovementEntry
  /** Present when `source === "undo"` (v2). Points at the entry being undone. */
  undoes?: UUID
}
