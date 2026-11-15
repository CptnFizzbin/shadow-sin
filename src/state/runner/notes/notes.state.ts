import { createReducer } from "@reduxjs/toolkit"

import type { RunnerData } from "#/system/model/runnerData.ts"

import { setNotes } from "./notes.actions.ts"

const initialState: RunnerData["notes"] = ""

export const notesReducer = createReducer(initialState, (builder) => {
  builder.addCase(setNotes, (_state, action) => action.payload)
})
