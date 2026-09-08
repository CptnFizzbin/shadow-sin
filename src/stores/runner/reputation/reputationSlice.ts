import { createReducer } from "@reduxjs/toolkit"

import type { RunnerData } from "#/system/runnerData.ts"

import { addReputationEntry, editReputationEntry } from "./reputationSlice.actions.ts"

const initialState: RunnerData["reputation"] = {
  ledger: [],
}

export const reputationReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(addReputationEntry, (state, action) => {
      state.ledger.push(action.payload.entry)
    })
    .addCase(editReputationEntry, (state, action) => {
      const { id, stat, amount, description } = action.payload
      const entry = state.ledger.find((e) => e.id === id)
      if (!entry) return

      entry.stat = stat
      entry.amount = amount
      entry.description = description
    })
})
