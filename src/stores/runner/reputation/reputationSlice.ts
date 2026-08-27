import { createReducer } from "@reduxjs/toolkit"

import type { RunnerData } from "#/system/runnerData.ts"

import { addReputationEntry } from "./reputationSlice.actions.ts"

const initialState: RunnerData["reputation"] = {
  ledger: [],
}

export const reputationReducer = createReducer(initialState, (builder) => {
  builder.addCase(addReputationEntry, (state, action) => {
    state.ledger.push(action.payload.entry)
  })
})
