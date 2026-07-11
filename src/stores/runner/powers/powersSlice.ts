import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "@reduxjs/toolkit"

import { NullUuid } from "#/lib/uuidUtils.ts"
import type { AdeptPowerData } from "#/system/powers/adeptPowerData.ts"

const initialState: AdeptPowerData[] = []

export const powersSlice = createSlice({
  name: "powers",
  initialState,
  reducers: {
    add: (state, action: PayloadAction<AdeptPowerData>) => {
      state.push(action.payload)
    },
    update: (state, action: PayloadAction<AdeptPowerData>) => {
      const index = state.findIndex((p) => p.id === action.payload.id)
      if (index !== -1) state[index] = action.payload
    },
    remove: (state, action: PayloadAction<string>) => {
      return state.filter((p) => p.id !== action.payload)
    },
    save: {
      prepare: (power: AdeptPowerData) => {
        if (!power.id || power.id === NullUuid) {
          return { payload: { ...power, id: crypto.randomUUID() } }
        }
        return { payload: power }
      },
      reducer: (state, action: PayloadAction<AdeptPowerData>) => {
        const index = state.findIndex((p) => p.id === action.payload.id)
        if (index === -1) state.push(action.payload)
        else state[index] = action.payload
      },
    },
  },
})

export const {
  add: addPower,
  update: updatePower,
  remove: removePower,
  save: savePower,
} = powersSlice.actions
