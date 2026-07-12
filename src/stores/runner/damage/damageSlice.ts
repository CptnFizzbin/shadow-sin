import { createReducer } from "@reduxjs/toolkit"

import type { RunnerData } from "#/system/runnerData.ts"

import { setDamage } from "./damageSlice.actions.ts"

const initialState: RunnerData["damage"] = {
  physical: 0,
  stun: 0,
  matrix: 0,
}

export const damageReducer = createReducer(initialState, (builder) => {
  builder.addCase(setDamage, (state, action) => {
    state[action.payload.track] = Math.max(0, action.payload.value)
  })
})
