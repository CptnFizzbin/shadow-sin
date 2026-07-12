import { createReducer } from "@reduxjs/toolkit"

import type { BuilderState } from "#/components/builder/builderState.ts"

import { setStartingNuyen } from "./nuyenSlice.actions.ts"

const initialState: BuilderState = {
  startingNuyen: undefined,
}

export const nuyenReducer = createReducer(initialState, (builder) => {
  builder.addCase(setStartingNuyen, (state, action) => {
    state.startingNuyen = action.payload
  })
})
