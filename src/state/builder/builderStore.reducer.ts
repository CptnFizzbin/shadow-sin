import { createReducer } from "@reduxjs/toolkit"

import type { BuilderState } from "#/components/builder/builderState.ts"
import { builderStateFactory } from "#/components/builder/builderState.ts"

import { BuilderActions } from "./builderStore.actions.ts"

export const builderStoreReducer = createReducer<BuilderState>(builderStateFactory(), (builder) => {
  builder.addCase(BuilderActions.nuyen.setStartingNuyen, (state, action) => {
    state.nuyen.starting = action.payload ?? null
  })
})
