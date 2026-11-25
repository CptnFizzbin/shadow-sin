import { createReducer } from "@reduxjs/toolkit"

import { LifestyleType } from "#data/finances/lifestyleType.ts"
import { standardLifestyle } from "#data/finances/runnerLifestyle.ts"
import type { RunnerData } from "#data/runner/runnerData.ts"

import { patchLifestyle, prepayLifestyle, setLifestyleMonthsPaid, setStandardLifestyle } from "./lifestyle.actions.ts"

const initialState: RunnerData["lifestyle"] = standardLifestyle(LifestyleType.Street)

export const lifestyleReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setStandardLifestyle, (state, action) => {
      return standardLifestyle(action.payload, { monthsPaid: state.monthsPaid, notes: state.notes })
    })
    .addCase(patchLifestyle, (state, action) => {
      Object.assign(state, action.payload)
    })
    .addCase(setLifestyleMonthsPaid, (state, action) => {
      state.monthsPaid = Math.max(0, action.payload)
    })
    .addCase(prepayLifestyle, (state, action) => {
      state.monthsPaid += action.payload.months
    })
})
