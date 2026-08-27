import { createReducer } from "@reduxjs/toolkit"

import type { RunnerData } from "#/system/runnerData.ts"
import { RUNNER_META_EPOCH } from "#/system/runnerData.ts"

import { recordLastExport } from "./metaSlice.actions.ts"

const initialState: RunnerData["_meta_"] = {
  sinVersion: RUNNER_META_EPOCH,
  appVersion: null,
  lastExportDate: null,
}

export const metaReducer = createReducer(initialState, (builder) => {
  builder.addCase(recordLastExport, (state, action) => {
    state.lastExportDate = action.payload
  })
})
