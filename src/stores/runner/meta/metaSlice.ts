import { createReducer } from "@reduxjs/toolkit"

import type { RunnerData } from "#/system/runnerData.ts"

import { recordLastExport } from "./metaSlice.actions.ts"

const initialState: RunnerData["_meta_"] = {
  version: 0,
  lastExportDate: null,
}

export const metaReducer = createReducer(initialState, (builder) => {
  builder.addCase(recordLastExport, (state, action) => {
    state.lastExportDate = action.payload
  })
})
