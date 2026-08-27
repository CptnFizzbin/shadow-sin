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
