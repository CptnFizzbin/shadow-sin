import { createReducer } from "@reduxjs/toolkit"

import type { TraditionData } from "#/system/magic/traditionData.ts"

import { saveTradition } from "./traditionSlice.actions.ts"

export const traditionReducer = createReducer(undefined as TraditionData | undefined, (builder) => {
  builder.addCase(saveTradition, (_state, action) => action.payload)
})
