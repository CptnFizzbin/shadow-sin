import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "@reduxjs/toolkit"

import type { TraditionData } from "#/system/magic/traditionData.ts"

export const traditionSlice = createSlice({
  name: "tradition",
  initialState: undefined as TraditionData | undefined,
  reducers: {
    save: (_state, action: PayloadAction<TraditionData>) => {
      return action.payload
    },
  },
})

export const { save: saveTradition } = traditionSlice.actions
