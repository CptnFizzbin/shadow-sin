import type { UUID } from "node:crypto"

import { createAction } from "@reduxjs/toolkit"

import type { KarmaLedgerEntry } from "#/system/karma/karmaLedgerEntry.ts"

export const addKarma = createAction("karma/addKarma", (amount: number) => {
  if (amount <= 0) throw new Error(`addKarma requires a positive amount, got ${amount}`)
  const entry: KarmaLedgerEntry = {
    id: crypto.randomUUID() as UUID,
    timestamp: new Date().toISOString(),
    amount,
    description: `Added ${amount} karma`,
    source: "addKarma",
  }
  return { payload: { amount, entry } }
})

export const spendKarma = createAction("karma/spendKarma", (amount: number) => {
  if (amount <= 0) throw new Error(`spendKarma requires a positive amount, got ${amount}`)
  return { payload: amount }
})
