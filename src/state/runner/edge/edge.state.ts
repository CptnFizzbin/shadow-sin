import { createReducer } from "@reduxjs/toolkit"

import type { RunnerData } from "#/data/runner/runnerData.ts"

import { burnEdge, setCurrentEdge } from "./edge.actions.ts"

const initialState: RunnerData["edge"] = {
  current: 0,
}

export const edgeReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setCurrentEdge.fulfilled, (state, action) => {
      state.current = action.payload
    })
    .addCase(burnEdge, (state) => {
      state.current = 0
    })
})
