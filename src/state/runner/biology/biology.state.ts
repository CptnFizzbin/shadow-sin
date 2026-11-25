import { createReducer } from "@reduxjs/toolkit"

import { MetatypeType } from "#data/biology/metatypeData.ts"
import { AwakeningType } from "#data/magic/awakeningType.ts"
import type { RunnerData } from "#data/runner/runnerData.ts"

import { setBiology } from "./biology.actions.ts"

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
