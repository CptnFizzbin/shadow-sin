import { createReducer } from "@reduxjs/toolkit"

import type { FeatureFlagsData } from "#/system/featureFlags/featureFlagsData.ts"

const initialState: FeatureFlagsData = {}

/** No actions yet — registered so `combineReducers` covers every `RunnerData` key. */
export const featureFlagsReducer = createReducer(initialState, () => {})
