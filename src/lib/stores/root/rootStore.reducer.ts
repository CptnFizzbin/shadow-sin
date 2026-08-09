import { combineReducers } from "@reduxjs/toolkit"

import { builderStoreReducer } from "#/lib/stores/builder/builderStore.reducer.ts"
import { runnerRootReducer } from "#/lib/stores/runner/runnerStore.reducer.ts"

export const rootReducer = combineReducers({
  runnerData: runnerRootReducer,
  builder: builderStoreReducer,
})
