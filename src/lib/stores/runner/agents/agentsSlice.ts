import { createReducer } from "@reduxjs/toolkit"

import type { AgentData } from "#/system/matrix/agentData.ts"

import { removeAgent, saveAgent } from "./agentsSlice.actions.ts"

const initialState: AgentData[] = []

export const agentsReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(saveAgent, (state, action) => {
      const index = state.findIndex((a) => a.id === action.payload.id)
      if (index >= 0) state[index] = action.payload
      else state.push(action.payload)
    })
    .addCase(removeAgent, (state, action) => {
      return state.filter((a) => a.id !== action.payload)
    })
})
