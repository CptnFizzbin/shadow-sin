import { createReducer } from "@reduxjs/toolkit"

import type { SpriteData } from "#/system/magic/spriteData.ts"

import { addSprite, removeSprite, saveSprite, updateSprite } from "./spritesSlice.actions.ts"

const initialState: SpriteData[] = []

export const spritesReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(addSprite, (state, action) => {
      state.push(action.payload)
    })
    .addCase(updateSprite, (state, action) => {
      const index = state.findIndex((s) => s.id === action.payload.id)
      if (index !== -1) state[index] = action.payload
    })
    .addCase(removeSprite, (state, action) => {
      return state.filter((s) => s.id !== action.payload)
    })
    .addCase(saveSprite, (state, action) => {
      const index = state.findIndex((s) => s.id === action.payload.id)
      if (index === -1) state.push(action.payload)
      else state[index] = action.payload
    })
})
