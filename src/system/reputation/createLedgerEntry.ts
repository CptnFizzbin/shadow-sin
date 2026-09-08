import { uuid } from "#/lib/uuidUtils.ts"

import type { ReputationLedgerEntry } from "./reputationLedgerEntry.ts"

export class ReputationUtils {
  public static createLedgerEntry = (entry: Omit<ReputationLedgerEntry, "id" | "timestamp">): ReputationLedgerEntry => {
    return {
      id: uuid.v7(),
      timestamp: new Date().toISOString(),
      ...entry,
    }
  }
}
