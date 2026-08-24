import { createReducer } from "@reduxjs/toolkit"

import type { AdeptPowerData } from "#/system/powers/adeptPowerData.ts"

import { addPower, removePower, savePower, updatePower } from "./powersSlice.actions.ts"

const initialState: AdeptPowerData[] = []

export const powersReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(addPower, (state, action) => {
      state.push(action.payload)
    })
    .addCase(updatePower, (state, action) => {
      const index = state.findIndex((p) => p.id === action.payload.id)
      if (index !== -1) state[index] = action.payload
    })
    .addCase(removePower, (state, action) => {
      return state.filter((p) => p.id !== action.payload)
    })
    .addCase(savePower, (state, action) => {
      const index = state.findIndex((p) => p.id === action.payload.id)
      if (index === -1) state.push(action.payload)
      else state[index] = action.payload
    })
})
