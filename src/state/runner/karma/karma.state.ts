import { createReducer } from "@reduxjs/toolkit"

import type { RunnerData } from "#/system/model/runnerData.ts"

import { addKarma, adjustKarma, buyKarma, sellKarma, spendKarma } from "./karma.actions.ts"

const initialState: RunnerData["karma"] = {
  total: 0,
  current: 0,
  log: [],
}

const insufficientKarmaError = (requested: number, available: number) =>
  new Error(`Insufficient karma: requested ${requested}, have ${available}`)

export const karmaReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(addKarma, (state, action) => {
      state.current += action.payload.amount
      state.total += action.payload.amount
      state.log.push(action.payload.entry)
    })
    .addCase(spendKarma, (state, action) => {
      const amount = action.payload
      if (amount > state.current) throw insufficientKarmaError(amount, state.current)
      state.current -= amount
    })
    .addCase(buyKarma, (state, action) => {
      state.current += action.payload.amount
      state.log.push(action.payload.entry)
    })
    .addCase(sellKarma, (state, action) => {
      const { amount, entry } = action.payload
      if (amount > state.current) throw insufficientKarmaError(amount, state.current)
      state.current -= amount
      state.log.push(entry)
    })
    .addCase(adjustKarma, (state, action) => {
      const { currentDelta, totalDelta, entry } = action.payload
      const nextCurrent = state.current + currentDelta
      const nextTotal = state.total + totalDelta
      if (nextCurrent < 0 || nextTotal < 0) {
        throw new Error(`Karma adjustment would go negative: current ${nextCurrent}, total ${nextTotal}`)
      }
      state.current = nextCurrent
      state.total = nextTotal
      state.log.push(entry)
    })
})
