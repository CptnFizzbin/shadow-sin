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
 * Enforces the Stash/Equip invariant on every write, regardless of which action produced it (the
 * item edit form's flat fields via `setItem`/`patchItem`, or the dedicated `setStashed` action):
 * the moment `stashed` becomes `true`, `equipped` is forced to `false`, with its prior value
 * recorded in `_state.equipOnUnstash` so un-stashing restores it automatically. This keeps
 * `item.equipped` always trustworthy on its own — readers never need to also check `!item.stashed`.
 *
 * @param wasStashed - whether the item was already stashed before this write, so a same-value
 * write (still stashed, or never stashed) doesn't re-capture/re-restore `equipped`.
 */
function reconcileEquippedForStash(item: ItemData, wasStashed: boolean): void {
  const isNowStashed = item.stashed === true

  if (isNowStashed && !wasStashed) {
    item._state = { ...item._state, equipOnUnstash: item.equipped === true }
    item.equipped = false
  } else if (!isNowStashed && wasStashed) {
    item.equipped = item._state?.equipOnUnstash === true
    item._state = { ...item._state, equipOnUnstash: undefined }
  }
}

export const gearReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(addItem, (state, action) => {
      state[action.payload.id] = action.payload
      reconcileEquippedForStash(state[action.payload.id], false)
      relinkItem(state, action.payload)
    })
    .addCase(setItem, (state, action) => {
      const wasStashed = state[action.payload.id]?.stashed === true
      state[action.payload.id] = action.payload
      reconcileEquippedForStash(state[action.payload.id], wasStashed)
      relinkItem(state, action.payload)
    })
    .addCase(patchItem, (state, action) => {
      const item = state[action.payload.itemId]
      if (!item) return
      const wasStashed = item.stashed === true
      state[action.payload.itemId] = {
        ...item,
        ...action.payload.data,
      }
      reconcileEquippedForStash(state[action.payload.itemId], wasStashed)
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
    })
    .addCase(setStashed, (state, action) => {
      const item = state[action.payload.id]
      if (!item) return
      const wasStashed = item.stashed === true
      item.stashed = action.payload.stashed
      reconcileEquippedForStash(item, wasStashed)
    })
})
