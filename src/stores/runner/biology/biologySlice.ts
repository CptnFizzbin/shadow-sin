import { createReducer } from "@reduxjs/toolkit"

import { AwakeningType } from "#/system/awakeningType.ts"
import { MetatypeType } from "#/system/metatypeData.ts"
import type { RunnerData } from "#/system/runnerData.ts"

import { setBiology } from "./biologySlice.actions.ts"

const initialState: RunnerData["biology"] = {
  metatype: MetatypeType.Human,
  awakening: AwakeningType.Mundane,
  gender: null,
  age: null,
  weight: null,
  height: null,
}

export const biologyReducer = createReducer(initialState, (builder) => {
  builder.addCase(setBiology, (_state, action) => action.payload)
})
