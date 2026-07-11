import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "@reduxjs/toolkit"

import { NumberUtils } from "#/lib/numberUtils.ts"
import type { RunnerData } from "#/system/runnerData.ts"

const initialState: RunnerData["edge"] = {
  current: 0,
}

export const edgeSlice = createSlice({
  name: "edge",
  initialState,
  reducers: {
    /**
     * Clamped to `[0, max]`. `max` isn't part of this slice's state — it's derived from
     * `attributes[AttributeKey.edge]` (see `edgeSlice.selectors.ts`) — so the clamp upper bound
     * is passed in by the caller rather than read off `state`.
     */
    setCurrent: (state, action: PayloadAction<{ value: number, max: number }>) => {
      state.current = NumberUtils.clamp(action.payload.value, { min: 0, max: action.payload.max })
    },
    restore: (state, action: PayloadAction<{ max: number }>) => {
      state.current = action.payload.max
    },
    /**
     * Just the `current` half of burning Edge — resets the pool to 0. The permanent `max`
     * reduction is a separate `attributes` action; see `burnEdge` in `edgeSlice.actions.ts` for
     * the combined dispatch.
     */
    burnCurrent: (state) => {
      state.current = 0
    },
  },
})

export const { setCurrent: setEdgeCurrent, restore: restoreEdge, burnCurrent: burnEdgeCurrent } = edgeSlice.actions
