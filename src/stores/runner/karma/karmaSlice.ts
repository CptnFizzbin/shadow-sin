import { createReducer } from "@reduxjs/toolkit"

import type { RunnerData } from "#/system/runnerData.ts"

import { addKarma, spendKarma } from "./karmaSlice.actions.ts"

const initialState: RunnerData["karma"] = {
  total: 0,
  current: 0,
  log: [],
}

export const karmaReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(addKarma, (state, action) => {
      state.current += action.payload.amount
      state.total += action.payload.amount
      state.log.push(action.payload.entry)
    })
    .addCase(spendKarma, (state, action) => {
      const amount = action.payload
      if (amount > state.current) throw new Error(`Insufficient karma: requested ${amount}, have ${state.current}`)
      state.current -= amount
    })
})
