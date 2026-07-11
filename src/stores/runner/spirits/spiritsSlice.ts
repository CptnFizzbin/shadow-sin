import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "@reduxjs/toolkit"

import type { SpiritData } from "#/system/magic/spiritData.ts"

const initialState: SpiritData[] = []

export const spiritsSlice = createSlice({
  name: "spirits",
  initialState,
  reducers: {
    save: (state, action: PayloadAction<SpiritData>) => {
      const index = state.findIndex((s) => s.id === action.payload.id)
      if (index >= 0) state[index] = action.payload
      else state.push(action.payload)
    },
    remove: (state, action: PayloadAction<string>) => {
      return state.filter((s) => s.id !== action.payload)
    },
  },
})

export const { save: saveSpirit, remove: removeSpirit } = spiritsSlice.actions
