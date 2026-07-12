import { createReducer } from "@reduxjs/toolkit"

import type { SpiritData } from "#/system/magic/spiritData.ts"

import { removeSpirit, saveSpirit } from "./spiritsSlice.actions.ts"

const initialState: SpiritData[] = []

export const spiritsReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(saveSpirit, (state, action) => {
      const index = state.findIndex((s) => s.id === action.payload.id)
      if (index >= 0) state[index] = action.payload
      else state.push(action.payload)
    })
    .addCase(removeSpirit, (state, action) => {
      return state.filter((s) => s.id !== action.payload)
    })
})
