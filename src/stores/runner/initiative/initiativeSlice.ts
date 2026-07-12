import { createReducer } from "@reduxjs/toolkit"

import type { RunnerData } from "#/system/runnerData.ts"

import {
  clearRolledResults,
  gainExtraPass,
  resetPasses,
  setGoingFirst,
  setRolledResults,
  togglePass,
} from "./initiativeSlice.actions.ts"

type InitiativeState = NonNullable<RunnerData["initiative"]>

const initialState: InitiativeState = {
  passesCompleted: [],
  extraPasses: 0,
}

export const initiativeReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(togglePass, (state, action) => {
      const completed = new Set(state.passesCompleted)
      if (completed.has(action.payload)) completed.delete(action.payload)
      else completed.add(action.payload)
      state.passesCompleted = Array.from(completed)
    })
    .addCase(setRolledResults, (state, action) => {
      state.rolledResults = action.payload
    })
    .addCase(clearRolledResults, (state) => {
      state.rolledResults = undefined
    })
    .addCase(setGoingFirst, (state, action) => {
      state.goingFirst = action.payload
    })
    .addCase(gainExtraPass, (state) => {
      state.extraPasses = (state.extraPasses ?? 0) + 1
    })
    .addCase(resetPasses, () => initialState)
})
