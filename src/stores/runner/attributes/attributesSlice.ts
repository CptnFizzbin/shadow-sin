import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "@reduxjs/toolkit"

import type { AttributeKey } from "#/system/attributeKey.ts"
import type { RunnerData } from "#/system/runnerData.ts"

const initialState = {} as RunnerData["attributes"]

export const attributesSlice = createSlice({
  name: "attributes",
  initialState,
  reducers: {
    set: (state, action: PayloadAction<{ key: AttributeKey, value: number }>) => {
      state[action.payload.key] = action.payload.value
    },
    /** Relative adjustment, optionally clamped to a minimum (e.g. burning Edge never drops below 1). */
    adjust: (state, action: PayloadAction<{ key: AttributeKey, delta: number, min?: number }>) => {
      const { key, delta, min } = action.payload
      const next = state[key] + delta
      state[key] = min !== undefined ? Math.max(min, next) : next
    },
  },
})

export const { set: setAttribute, adjust: adjustAttribute } = attributesSlice.actions
