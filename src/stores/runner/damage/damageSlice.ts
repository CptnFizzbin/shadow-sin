import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "@reduxjs/toolkit"

import type { DamageTrackKey } from "#/system/damageTrackKey.ts"
import type { RunnerData } from "#/system/runnerData.ts"

const initialState: RunnerData["damage"] = {
  physical: 0,
  stun: 0,
  matrix: 0,
}

export const damageSlice = createSlice({
  name: "damage",
  initialState,
  reducers: {
    setDamage: (state, action: PayloadAction<{ track: DamageTrackKey, value: number }>) => {
      state[action.payload.track] = Math.max(0, action.payload.value)
    },
  },
})

export const { setDamage } = damageSlice.actions
