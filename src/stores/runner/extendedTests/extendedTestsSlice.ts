import { createReducer } from "@reduxjs/toolkit"

import type { RunnerData } from "#/system/runnerData.ts"

import {
  addExtendedTest,
  removeExtendedTest,
  setExtendedTestAttempts,
  setExtendedTestHits,
  updateExtendedTest,
} from "./extendedTestsSlice.actions.ts"

const initialState: RunnerData["extendedTests"] = []

export const extendedTestsReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(addExtendedTest, (state, action) => {
      state.push(action.payload)
    })
    .addCase(updateExtendedTest, (state, action) => {
      const index = state.findIndex((test) => test.id === action.payload.id)
      if (index >= 0) state[index] = action.payload
    })
    .addCase(removeExtendedTest, (state, action) => {
      return state.filter((test) => test.id !== action.payload)
    })
    .addCase(setExtendedTestHits, (state, action) => {
      const test = state.find((item) => item.id === action.payload.id)
      if (test) test.currentHits = action.payload.hits
    })
    .addCase(setExtendedTestAttempts, (state, action) => {
      const test = state.find((item) => item.id === action.payload.id)
      if (test) test.attempts = action.payload.attempts
    })
})
