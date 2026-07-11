import { combineReducers } from "#/integrations/reduxToolkit/combineReducers.ts"

import { qualitiesSlice } from "./qualities/qualitiesSlice.ts"

export const runnerRootReducer = combineReducers({
  qualities: qualitiesSlice.reducer,
})
