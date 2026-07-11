import type { UUID } from "node:crypto"

import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "@reduxjs/toolkit"

import type { KarmaLedgerEntry } from "#/system/karma/karmaLedgerEntry.ts"
import type { RunnerData } from "#/system/runnerData.ts"

const initialState: RunnerData["karma"] = {
  total: 0,
  current: 0,
  log: [],
}

export const karmaSlice = createSlice({
  name: "karma",
  initialState,
  reducers: {
    addKarma: {
      prepare: (amount: number) => {
        if (amount <= 0) throw new Error(`addKarma requires a positive amount, got ${amount}`)
        const entry: KarmaLedgerEntry = {
          id: crypto.randomUUID() as UUID,
          timestamp: new Date().toISOString(),
          amount,
          description: `Added ${amount} karma`,
          source: "addKarma",
        }
        return { payload: { amount, entry } }
      },
      reducer: (state, action: PayloadAction<{ amount: number, entry: KarmaLedgerEntry }>) => {
        state.current += action.payload.amount
        state.total += action.payload.amount
        state.log.push(action.payload.entry)
      },
    },
    spendKarma: (state, action: PayloadAction<number>) => {
      const amount = action.payload
      if (amount <= 0) throw new Error(`spendKarma requires a positive amount, got ${amount}`)
      if (amount > state.current) throw new Error(`Insufficient karma: requested ${amount}, have ${state.current}`)
      state.current -= amount
    },
  },
})

export const { addKarma, spendKarma } = karmaSlice.actions
