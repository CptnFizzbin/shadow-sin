import { createReducer } from "@reduxjs/toolkit"

import type { BuilderState } from "#/components/builder/builderState.ts"
import { builderStateFactory } from "#/components/builder/builderState.ts"

import { BuilderStateActions } from "./builderStore.actions.ts"

export const builderStoreReducer = createReducer<BuilderState>(builderStateFactory(), (builder) => {
  builder.addCase(BuilderStateActions.nuyen.setStartingNuyen, (state, action) => {
    state.nuyen.starting = action.payload ?? null
  })
})
