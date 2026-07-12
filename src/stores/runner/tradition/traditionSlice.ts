import { createReducer } from "@reduxjs/toolkit"

import type { TraditionData } from "#/system/magic/traditionData.ts"

import { saveTradition } from "./traditionSlice.actions.ts"

/**
 * `combineReducers` requires every reducer to return a defined value for its initial state
 * (Redux's own docs suggest `null` in place of `undefined`) — `RunnerData["tradition"]` allows
 * `null` for exactly this reason; no real `RunnerData` ever originates from this default, since
 * actual runner data always comes from `runnerDataFactory`/migrations.
 */
export const traditionReducer = createReducer<TraditionData | null>(null, (builder) => {
  builder.addCase(saveTradition, (_state, action) => action.payload)
})
