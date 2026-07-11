import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "@reduxjs/toolkit"

import type { QualityData } from "#/system/qualityData.ts"

const initialState: QualityData[] = []

export const qualitiesSlice = createSlice({
  name: "qualities",
  initialState,
  reducers: {
    add: (state, action: PayloadAction<QualityData>) => {
      state.push(action.payload)
    },
    update: (state, action: PayloadAction<QualityData>) => {
      const index = state.findIndex((q) => q.name === action.payload.name)
      if (index !== -1) state[index] = action.payload
    },
    remove: (state, action: PayloadAction<string>) => {
      return state.filter((q) => q.name !== action.payload)
    },
  },
})

export const { add: addQuality, update: updateQuality, remove: removeQuality } = qualitiesSlice.actions
