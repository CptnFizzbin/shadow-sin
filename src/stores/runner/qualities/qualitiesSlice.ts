import { createReducer } from "@reduxjs/toolkit"

import type { QualityData } from "#/system/qualityData.ts"

import { addQuality, removeQuality, updateQuality } from "./qualitiesSlice.actions.ts"

const initialState: QualityData[] = []

export const qualitiesReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(addQuality, (state, action) => {
      state.push(action.payload)
    })
    .addCase(updateQuality, (state, action) => {
      const index = state.findIndex((q) => q.name === action.payload.name)
      if (index !== -1) state[index] = action.payload
    })
    .addCase(removeQuality, (state, action) => {
      return state.filter((q) => q.name !== action.payload)
    })
})
