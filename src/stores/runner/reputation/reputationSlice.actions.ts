import { createAction } from "@reduxjs/toolkit"

import type { UUID } from "#/lib/uuidUtils.ts"
import type { ReputationLedgerEntry, ReputationStatType } from "#/system/reputation/reputationLedgerEntry.ts"

/**
 * Add a reputation ledger entry.
 */
export const addReputationEntry = createAction(
  "reputation/addEntry",
  (stat: ReputationStatType, amount: number, description: string) => {
    const entry: ReputationLedgerEntry = {
      id: crypto.randomUUID() as UUID,
      stat,
      timestamp: new Date().toISOString(),
      amount,
      description,
      source: "manual",
    }
    return { payload: { entry } }
  },
)

/**
 * Edit an existing reputation ledger entry's stat, amount, and description in place. Its `id`,
 * `timestamp`, and `source` are left untouched.
 */
export const editReputationEntry = createAction(
  "reputation/editEntry",
  (id: UUID, stat: ReputationStatType, amount: number, description: string) => {
    return { payload: { id, stat, amount, description } }
  },
)

export const removeReputationEntry = createAction<{ id: UUID }>("reputation/removeEntry")
