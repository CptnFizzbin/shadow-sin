import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "@reduxjs/toolkit"

import { AwakeningType } from "#/system/awakeningType.ts"
import { MetatypeType } from "#/system/metatypeData.ts"
import type { RunnerData } from "#/system/runnerData.ts"

const initialState: RunnerData["biology"] = {
  metatype: MetatypeType.Human,
  awakening: AwakeningType.Mundane,
}

export const biologySlice = createSlice({
  name: "biology",
  initialState,
  reducers: {
    /**
     * Whole-object replace. The old `BiologyStore` never grew bespoke CRUD methods either — call
     * sites (e.g. metatype/awakening changes) mutate `biology` directly via `sheet.setState(...)`
     * because those changes also touch `attributes`/`qualities` atomically, which a single-key
     * slice reducer can't express. This action exists for parity with the old store's inherited
     * `set`/`setState`, not as a real domain action.
     */
    set: (_state, action: PayloadAction<RunnerData["biology"]>) => {
      return action.payload
    },
  },
})

export const { set: setBiology } = biologySlice.actions
