import type { UUID } from "node:crypto"

import { createAction } from "@reduxjs/toolkit"

import { NullUuid } from "#/lib/uuidUtils.ts"
import type { ItemData } from "#/system/itemData.ts"

export const addItem = createAction("gear/add", (item: Omit<ItemData, "id">) => {
  return { payload: { ...item, id: crypto.randomUUID() as UUID } }
})

export const setItem = createAction<ItemData>("gear/set")

export const removeItem = createAction<{ id: UUID, removeChildren?: boolean }>("gear/remove")

/** Lets a caller decide whether to dispatch `addItem` or `setItem` for a save. */
export function isNewItem(item: ItemData): boolean {
  return !item.id || item.id === NullUuid
}
