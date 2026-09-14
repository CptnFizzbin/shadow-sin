import { createAction } from "@reduxjs/toolkit"

import type { SpriteData } from "#/system/model/magic/spriteData.ts"
import { NullUuid } from "#/utils/uuidUtils.ts"

export const addSprite = createAction<SpriteData>("sprites/add")
export const updateSprite = createAction<SpriteData>("sprites/update")
export const removeSprite = createAction<string>("sprites/remove")

export const saveSprite = createAction("sprites/save", (sprite: SpriteData) => {
  if (!sprite.id || sprite.id === NullUuid) {
    return { payload: { ...sprite, id: crypto.randomUUID() } }
  }
  return { payload: sprite }
})
