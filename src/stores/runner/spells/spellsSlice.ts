import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "@reduxjs/toolkit"

import { NullUuid } from "#/lib/uuidUtils.ts"
import type { SpellData } from "#/system/magic/spellData.ts"

const initialState: SpellData[] = []

export const spellsSlice = createSlice({
  name: "spells",
  initialState,
  reducers: {
    add: (state, action: PayloadAction<SpellData>) => {
      state.push(action.payload)
    },
    update: (state, action: PayloadAction<SpellData>) => {
      const index = state.findIndex((s) => s.id === action.payload.id)
      if (index !== -1) state[index] = action.payload
    },
    remove: (state, action: PayloadAction<string>) => {
      return state.filter((s) => s.id !== action.payload)
    },
    toggleSustained: (state, action: PayloadAction<string>) => {
      const target = state.find((s) => s.id === action.payload)
      if (target) target.sustained = !target.sustained
    },
    save: {
      prepare: (spell: SpellData) => {
        if (!spell.id || spell.id === NullUuid) {
          return { payload: { ...spell, id: crypto.randomUUID() } }
        }
        return { payload: spell }
      },
      reducer: (state, action: PayloadAction<SpellData>) => {
        const index = state.findIndex((s) => s.id === action.payload.id)
        if (index === -1) state.push(action.payload)
        else state[index] = action.payload
      },
    },
  },
})

export const {
  add: addSpell,
  update: updateSpell,
  remove: removeSpell,
  toggleSustained: toggleSpellSustained,
  save: saveSpell,
} = spellsSlice.actions
