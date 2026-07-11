import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "@reduxjs/toolkit"

import { NullUuid } from "#/lib/uuidUtils.ts"
import type { SpriteData } from "#/system/magic/spriteData.ts"

const initialState: SpriteData[] = []

export const spritesSlice = createSlice({
  name: "sprites",
  initialState,
  reducers: {
    add: (state, action: PayloadAction<SpriteData>) => {
      state.push(action.payload)
    },
    update: (state, action: PayloadAction<SpriteData>) => {
      const index = state.findIndex((s) => s.id === action.payload.id)
      if (index !== -1) state[index] = action.payload
    },
    remove: (state, action: PayloadAction<string>) => {
      return state.filter((s) => s.id !== action.payload)
    },
    save: {
      prepare: (sprite: SpriteData) => {
        if (!sprite.id || sprite.id === NullUuid) {
          return { payload: { ...sprite, id: crypto.randomUUID() } }
        }
        return { payload: sprite }
      },
      reducer: (state, action: PayloadAction<SpriteData>) => {
        const index = state.findIndex((s) => s.id === action.payload.id)
        if (index === -1) state.push(action.payload)
        else state[index] = action.payload
      },
    },
  },
})

export const {
  add: addSprite,
  update: updateSprite,
  remove: removeSprite,
  save: saveSprite,
} = spritesSlice.actions
