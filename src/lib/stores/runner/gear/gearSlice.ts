import { createReducer } from "@reduxjs/toolkit"

import type { ItemData } from "#/system/itemData.ts"
import type { RunnerData } from "#/system/runnerData.ts"

import { addItem, patchItem, removeItem, setEquipped, setItem, setStashed } from "./gearSlice.actions.ts"

const initialState: RunnerData["gear"] = {}

/**
 * Keeps `parentId`/`childIds` consistent across the whole gear record whenever `item` is
 * added/updated: `item`'s parent gains (or loses) it in `childIds`, and — when `item` explicitly
 * lists its own `childIds` — those children's `parentId` is set or cleared to match.
 */
function relinkItem(state: RunnerData["gear"], item: ItemData) {
  for (const savedItem of Object.values(state)) {
    savedItem.childIds ??= []

    if (savedItem.id === item.parentId) {
      if (!savedItem.childIds.includes(item.id)) {
        savedItem.childIds.push(item.id)
      }
    } else {
      savedItem.childIds = savedItem.childIds.filter((id) => id !== item.id)
    }

    if (item.childIds !== undefined) {
      if (item.childIds.includes(savedItem.id)) {
        savedItem.parentId = item.id
      } else if (savedItem.parentId === item.id) {
        savedItem.parentId = undefined
      }
    }
  }
}

/** Deletes `id` and drops it from its parent's `childIds`. Leaves any children orphaned. */
function removeItemById(state: RunnerData["gear"], id: string) {
  const target = state[id]
  if (!target) return

  delete state[id]

  const parent = target.parentId ? state[target.parentId] : undefined
  if (parent) {
    parent.childIds = parent.childIds?.filter((childId) => childId !== id)
  }
}

/** Deletes `id` and every descendant reachable through `childIds`. */
function removeItemTree(state: RunnerData["gear"], id: string) {
  const target = state[id]
  if (!target) return

  for (const childId of target.childIds ?? []) {
    removeItemTree(state, childId)
  }

  removeItemById(state, id)
}

/**
 * Keeps `equipped`/`stashed` and their `_state` mirror in sync on every write, regardless of
 * which side a caller wrote to (the item edit form writes the top-level fields; `setEquipped`/
 * `setStashed` write both directly, but a `patchItem` caller could still touch just one side).
 * `_state` is internal — see `ItemData._state`'s doc comment — so top-level wins when both are
 * present, since it's the field readers and forms actually touch today.
 */
function syncItemState(item: ItemData): void {
  if (item.equipped !== undefined) {
    item._state = { ...item._state, equipped: item.equipped }
  } else if (item._state?.equipped !== undefined) {
    item.equipped = item._state.equipped
  }

  if (item.stashed !== undefined) {
    item._state = { ...item._state, stashed: item.stashed }
  } else if (item._state?.stashed !== undefined) {
    item.stashed = item._state.stashed
  }
}

export const gearReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(addItem, (state, action) => {
      state[action.payload.id] = action.payload
      syncItemState(state[action.payload.id])
      relinkItem(state, action.payload)
    })
    .addCase(setItem, (state, action) => {
      state[action.payload.id] = action.payload
      syncItemState(state[action.payload.id])
      relinkItem(state, action.payload)
    })
    .addCase(patchItem, (state, action) => {
      const item = state[action.payload.itemId]
      if (!item) return
      state[action.payload.itemId] = {
        ...item,
        ...action.payload.data,
      }
      syncItemState(state[action.payload.itemId])
    })
    .addCase(removeItem, (state, action) => {
      const { id, removeChildren } = action.payload
      if (removeChildren) {
        removeItemTree(state, id)
      } else {
        removeItemById(state, id)
      }
    })
    .addCase(setEquipped, (state, action) => {
      const item = state[action.payload.id]
      if (!item) return
      item.equipped = action.payload.equipped
      item._state = { ...item._state, equipped: action.payload.equipped }
    })
    .addCase(setStashed, (state, action) => {
      const item = state[action.payload.id]
      if (!item) return
      item.stashed = action.payload.stashed
      item._state = { ...item._state, stashed: action.payload.stashed }
    })
})
