import { purple } from "@mui/material/colors"

import type { UUID } from "#/lib/uuidUtils.ts"

export enum ReputationStatType {
  streetCred = "streetCred",
  notoriety = "notoriety",
  publicAwareness = "publicAwareness",
}

export const ReputationStatTypeData: Record<ReputationStatType, {
  label: string
  chipColor: string
  positiveColor: string
  negativeColor: string
}> = {
  [ReputationStatType.streetCred]: {
    label: "Street Cred",
    chipColor: "success.main",
    positiveColor: "success.main",
    negativeColor: "error.main",
  },
  [ReputationStatType.notoriety]: {
    label: "Notoriety",
    chipColor: "error.main",
    positiveColor: "error.main",
    negativeColor: "success.main",
  },
  [ReputationStatType.publicAwareness]: {
    label: "Public Awareness",
    chipColor: purple[400],
    positiveColor: "info.main",
    negativeColor: purple[400],
  },
}

/**
 * One audit-trail entry for a reputation change.
 *
 * Stored on `RunnerData.reputation.ledger`. Entries are append-only by default — a mistaken
 * change is usually corrected with a counter-entry (e.g. adding a negative value to reverse a
 * prior positive one) so the trail stays honest — but `stat`/`amount`/`description` can be
 * edited in place (see `editReputationEntry`) to fix a typo or a data-entry mistake without
 * leaving a confusing counter-entry behind. `id`, `timestamp`, and `source` never change.
 *
 * The displayed reputation value for a stat is the sum of all ledger entries affecting that
 * stat, plus a derived base for `streetCred`: `floor(karma.total / 10)` (see
 * `ReputationSelectors.selectStreetCred`).
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
  /** @deprecated To be removed */
  source?: string
}
