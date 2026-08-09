import { createReducer } from "@reduxjs/toolkit"

import { burnEdge } from "#/lib/stores/runner/edge/edgeSlice.actions.ts"
import { AttributeKey } from "#/system/attributeKey.ts"
import type { RunnerData } from "#/system/runnerData.ts"

import { adjustAttribute, setAttribute } from "./attributesSlice.actions.ts"

const initialState = {} as RunnerData["attributes"]

export const attributesReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setAttribute, (state, action) => {
      state[action.payload.key] = action.payload.value
    })
    .addCase(adjustAttribute, (state, action) => {
      const { key, delta, min } = action.payload
      const next = (state[key] ?? 0) + delta
      state[key] = min !== undefined ? Math.max(min, next) : next
    })
    .addCase(burnEdge, (state) => {
      state[AttributeKey.edge] = Math.max(1, (state[AttributeKey.edge] ?? 0) - 1)
    })
})
