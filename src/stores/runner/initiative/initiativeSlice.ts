import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "@reduxjs/toolkit"

import type { RunnerData } from "#/system/runnerData.ts"

type InitiativeState = NonNullable<RunnerData["initiative"]>

const initialState: InitiativeState = {
  passesCompleted: [],
  extraPasses: 0,
}

export const initiativeSlice = createSlice({
  name: "initiative",
  initialState,
  reducers: {
    togglePass: (state, action: PayloadAction<number>) => {
      const completed = new Set(state.passesCompleted)
      if (completed.has(action.payload)) completed.delete(action.payload)
      else completed.add(action.payload)
      state.passesCompleted = Array.from(completed)
    },
    setRolledResults: (state, action: PayloadAction<number[]>) => {
      state.rolledResults = action.payload
    },
    clearRolledResults: (state) => {
      state.rolledResults = undefined
    },
    setGoingFirst: (state, action: PayloadAction<boolean>) => {
      state.goingFirst = action.payload
    },
    gainExtraPass: (state) => {
      state.extraPasses = (state.extraPasses ?? 0) + 1
    },
    resetPasses: () => initialState,
  },
})

export const {
  togglePass,
  setRolledResults,
  clearRolledResults,
  setGoingFirst,
  gainExtraPass,
  resetPasses,
} = initiativeSlice.actions
