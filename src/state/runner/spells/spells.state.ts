import { createReducer } from "@reduxjs/toolkit"

import type { SpellData } from "#/system/model/magic/spellData.ts"

import {
  addSpell,
  removeSpell,
  saveSpell,
  setSpellSustainTarget,
  startSustainingSpell,
  stopSustainingSpell,
  updateSpell,
} from "./spells.actions.ts"

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
    .addCase(startSustainingSpell, (state, action) => {
      const spell = state.find((s) => s.id === action.payload.id)
      if (!spell) return
      spell.sustained = true
      if (action.payload.target) spell.sustainedOn = action.payload.target
    })
    .addCase(stopSustainingSpell, (state, action) => {
      const spell = state.find((s) => s.id === action.payload)
      if (spell) spell.sustained = false
    })
    .addCase(setSpellSustainTarget, (state, action) => {
      const spell = state.find((s) => s.id === action.payload.id)
      if (spell) spell.sustainedOn = action.payload.target
    })
    .addCase(saveSpell, (state, action) => {
      const index = state.findIndex((s) => s.id === action.payload.id)
      if (index === -1) state.push(action.payload)
      else state[index] = action.payload
    })
})
