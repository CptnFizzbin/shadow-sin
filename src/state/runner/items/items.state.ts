import { createReducer } from "@reduxjs/toolkit"

import { getItemState, reconcileItemState } from "#/system/formulas/items/itemStateRules.ts"
import { isEntityWithDamage } from "#/system/model/entities/entityTraits.ts"
import type { ItemData } from "#/system/model/items/itemData.ts"
import type { ItemCatalog } from "#/system/model/items/itemUtils.ts"
import type { UUID } from "#/utils/uuidUtils.ts"

import { addItem, patchItem, removeItem, setDamage, setItem, setState } from "./items.actions.ts"

const initialState: ItemCatalog = {}

/**
 * Keeps `items.parentId`/`items.childIds` consistent across the whole gear record whenever `item`
 * is added/updated: `item`'s parent gains (or loses) it in `childIds`, and — when `item`
 * explicitly lists its own `childIds` — those children's `parentId` is set or cleared to match.
 *
 * Always replaces `savedItem.items` wholesale rather than mutating its `parentId`/`childIds`
 * fields in place: `item` (and therefore `item.items`) can be a payload dispatched straight from
 * a form that never touched attachment fields, so it may still be the exact object reference the
 * store handed out on a previous read — Immer freezes that on the way out, and writing into a
 * frozen nested object throws.
 */
function relinkItem(state: ItemCatalog, item: ItemData) {
  for (const savedItem of Object.values(state)) {
    let childIds = savedItem.items.childIds

    if (savedItem.id === item.items.parentId) {
      if (!childIds.includes(item.id)) {
        childIds = [...childIds, item.id]
      }
    } else {
      childIds = childIds.filter((id) => id !== item.id)
    }

    let parentId = savedItem.items.parentId

    if (item.items.childIds.includes(savedItem.id)) {
      parentId = item.id
    } else if (parentId === item.id) {
      parentId = null
    }

    savedItem.items = { parentId, childIds }
  }
}

/** Deletes `id` and drops it from its parent's `childIds`. Leaves any children orphaned. */
function removeItemById(state: ItemCatalog, id: UUID) {
  const target = state[id]
  if (!target) return

  delete state[id]

  const parent = target.items.parentId ? state[target.items.parentId] : undefined
  if (parent) {
    parent.items = { ...parent.items, childIds: parent.items.childIds.filter((childId) => childId !== id) }
  }
}

/** Deletes `id` and every descendant reachable through `childIds`. */
function removeItemTree(state: ItemCatalog, id: UUID) {
  const target = state[id]
  if (!target) return

  for (const childId of target.items.childIds) {
    removeItemTree(state, childId)
  }

  removeItemById(state, id)
}

export const ItemStateUtils = {
  relinkItem,
  removeItemById,
  removeItemTree,
  /** Applies a write's Item State rules to one Item — see `reconcileItemState`. */
  reconcileState: reconcileItemState,
}

export const gearReducer = createReducer(initialState, (builder) => {
  builder
    // Copy `action.payload` rather than storing it by reference: the same action also reaches
    // the normalized `items` catalog's `itemsRootReducer` (`src/state/items/items.reducer.ts`),
    // and Immer freezes whatever a produce call incorporates by reference into its output —
    // so without the copy, the second reducer to run would be handed an already-frozen payload
    // and throw the moment `reconcileState`/`relinkItem` tried to write to it.
    .addCase(addItem, (state, action) => {
      state[action.payload.id] = { ...action.payload }
      relinkItem(state, state[action.payload.id])
      reconcileItemState(state, action.payload.id, undefined)
    })
    .addCase(setItem, (state, action) => {
      const previousState = state[action.payload.id] ? getItemState(state[action.payload.id]) : undefined
      state[action.payload.id] = { ...action.payload }
      relinkItem(state, state[action.payload.id])
      reconcileItemState(state, action.payload.id, previousState)
    })
    .addCase(patchItem, (state, action) => {
      const item = state[action.payload.itemId]
      if (!item) return
      const previousState = getItemState(item)
      state[action.payload.itemId] = {
        ...item,
        ...action.payload.data,
      }
      reconcileItemState(state, action.payload.itemId, previousState)
    })
    .addCase(removeItem, (state, action) => {
      const { id, removeChildren } = action.payload
      if (removeChildren) {
        removeItemTree(state, id)
      } else {
        removeItemById(state, id)
      }
    })
    .addCase(setState, (state, action) => {
      const item = state[action.payload.id]
      if (!item) return
      const previousState = getItemState(item)
      item.state = action.payload.state
      reconcileItemState(state, action.payload.id, previousState)
    })
    .addCase(setDamage, (state, action) => {
      const item = state[action.payload.itemId]
      if (!item || !isEntityWithDamage(item)) return
      item.damage[action.payload.track] = Math.max(0, action.payload.value)
    })
})
