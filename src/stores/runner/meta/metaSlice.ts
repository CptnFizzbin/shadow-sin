import { createReducer } from "@reduxjs/toolkit"

import type { RunnerData } from "#/system/runnerData.ts"
import { RUNNER_META_EPOCH } from "#/system/runnerData.ts"

import { recordLastExport } from "./metaSlice.actions.ts"

const initialState: RunnerData["_meta_"] = {
  appVersion: RUNNER_META_EPOCH,
  lastExportDate: null,
}

export const metaReducer = createReducer(initialState, (builder) => {
  builder.addCase(recordLastExport, (state, action) => {
    state.lastExportDate = action.payload
  })
})
