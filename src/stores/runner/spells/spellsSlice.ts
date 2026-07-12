import { createReducer } from "@reduxjs/toolkit"

import type { SpellData } from "#/system/magic/spellData.ts"

import { addSpell, removeSpell, saveSpell, toggleSpellSustained, updateSpell } from "./spellsSlice.actions.ts"

const initialState: SpellData[] = []

export const spellsReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(addSpell, (state, action) => {
      state.push(action.payload)
    })
    .addCase(updateSpell, (state, action) => {
      const index = state.findIndex((s) => s.id === action.payload.id)
      if (index !== -1) state[index] = action.payload
    })
    .addCase(removeSpell, (state, action) => {
      return state.filter((s) => s.id !== action.payload)
    })
    .addCase(toggleSpellSustained, (state, action) => {
      const target = state.find((s) => s.id === action.payload)
      if (target) target.sustained = !target.sustained
    })
    .addCase(saveSpell, (state, action) => {
      const index = state.findIndex((s) => s.id === action.payload.id)
      if (index === -1) state.push(action.payload)
      else state[index] = action.payload
    })
})
