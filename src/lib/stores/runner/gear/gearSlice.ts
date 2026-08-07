import { createReducer } from "@reduxjs/toolkit"

import type { ItemData } from "#/system/itemData.ts"
import type { RunnerData } from "#/system/runnerData.ts"

import { addItem, patchItem, removeItem, setItem, stashItem, unstashItem } from "./gearSlice.actions.ts"

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

export const gearReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(addItem, (state, action) => {
      state[action.payload.id] = action.payload
      relinkItem(state, action.payload)
    })
    .addCase(setItem, (state, action) => {
      state[action.payload.id] = action.payload
      relinkItem(state, action.payload)
    })
    .addCase(patchItem, (state, action) => {
      const item = state[action.payload.itemId]
      if (!item) return
      state[action.payload.itemId] = {
        ...item,
        ...action.payload.data,
      }
    })
    .addCase(removeItem, (state, action) => {
      const { id, removeChildren } = action.payload
      if (removeChildren) {
        removeItemTree(state, id)
      } else {
        removeItemById(state, id)
      }
    })
    .addCase(stashItem, (state, action) => {
      const item = state[action.payload.id]
      if (!item) return
      item._state = { ...item._state, stashed: true }
    })
    .addCase(unstashItem, (state, action) => {
      const item = state[action.payload.id]
      if (!item) return
      item._state = { ...item._state, stashed: false }
    })
})
