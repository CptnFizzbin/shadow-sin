import { createAction } from "@reduxjs/toolkit"

import { NullUuid } from "#/lib/uuidUtils.ts"
import type { SpriteData } from "#/system/magic/spriteData.ts"

export const addSprite = createAction<SpriteData>("sprites/add")
export const updateSprite = createAction<SpriteData>("sprites/update")
export const removeSprite = createAction<string>("sprites/remove")

export const saveSprite = createAction("sprites/save", (sprite: SpriteData) => {
  if (!sprite.id || sprite.id === NullUuid) {
    return { payload: { ...sprite, id: crypto.randomUUID() } }
  }
  return { payload: sprite }
})
