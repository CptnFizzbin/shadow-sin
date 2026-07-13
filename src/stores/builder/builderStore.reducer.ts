import type { Reducer } from "@reduxjs/toolkit"
import { combineReducers } from "@reduxjs/toolkit"

import type { BuilderState } from "#/components/builder/builderState.ts"

import { nuyenReducer } from "./nuyen/nuyenSlice.ts"

export const builderStoreReducer: Reducer<BuilderState> = combineReducers({
  nuyen: nuyenReducer,
})
