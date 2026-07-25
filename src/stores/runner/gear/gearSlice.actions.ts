import type { UUID } from "node:crypto"

import { createAction } from "@reduxjs/toolkit"

import { NullUuid } from "#/lib/uuidUtils.ts"
import type { ItemData } from "#/system/itemData.ts"

export const addItem = createAction("gear/add", (item: Omit<ItemData, "id">) => {
  return { payload: { ...item, id: crypto.randomUUID() as UUID } }
})

export const setItem = createAction<ItemData>("gear/set")

export const removeItem = createAction<{ id: UUID, removeChildren?: boolean }>("gear/remove")

/**
 * TODO(#388): stub — `ItemData` has no real `_state.stashed` field yet
 * (docs/features/0012-item-stashing.md), so the reducer is currently a no-op. Exists so call
 * sites (e.g. the License Check checklist) have a properly named action to dispatch ahead of
 * that field landing, rather than repurposing `setItem` for an unrelated concept.
 */
export const stashItem = createAction<{ id: UUID }>("gear/stash")

/** Lets a caller decide whether to dispatch `addItem` or `setItem` for a save. */
export function isNewItem(item: ItemData): boolean {
  return !item.id || item.id === NullUuid
}
