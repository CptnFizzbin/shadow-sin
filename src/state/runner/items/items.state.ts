import { createReducer } from "@reduxjs/toolkit"

import { planItemSale } from "#/system/formulas/items/itemSale.ts"
import {
  getItemState,
  getItemStateActions,
  ItemStateAction,
  reconcileItemState,
} from "#/system/formulas/items/itemStateRules.ts"
import { isEntityWithDamage } from "#/system/model/entities/entityTraits.ts"
import type { ItemData } from "#/system/model/items/itemData.ts"
import { ItemState } from "#/system/model/items/itemState.ts"
import type { ItemCatalog } from "#/system/model/items/itemUtils.ts"
import { isFocusData } from "#/system/model/items/magicalData.ts"
import type { UUID } from "#/utils/uuidUtils.ts"

import {
  addItem,
  bondFocus,
  consumeItem,
  patchItem,
  removeItem,
  sellItem,
  setDamage,
  setItem,
  setState,
  unbondFocus,
} from "./items.actions.ts"

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

/** Sells `id` as planned by `planItemSale`: removes what's sold and detaches what stays behind. */
function sellItemById(state: ItemCatalog, id: UUID, sellAttachments: boolean) {
  const { soldIds, detachedIds } = planItemSale(state, id, sellAttachments)

  for (const detachedId of detachedIds) {
    const detached = state[detachedId]
    detached.items = { ...detached.items, parentId: null }
  }

  for (const soldId of soldIds) {
    removeItemById(state, soldId)
  }
}

/**
 * Consumes one unit of `id`: makes it Active and lowers its `quantity` by one. A no-op unless the
 * Item currently offers Consume (an Available Consumable with a unit left) and ends up Active.
 */
function consumeItemById(state: ItemCatalog, id: UUID) {
  const item = state[id]
  if (!item || !getItemStateActions(item).includes(ItemStateAction.consume)) return

  const previousState = getItemState(item)
  item.state = ItemState.active
  reconcileItemState(state, id, previousState)

  // An Attachment can't be more active than its parent, so reconciling may have refused Active —
  // nothing was taken then, and no unit is spent.
  if (getItemState(item) === ItemState.active) {
    item.quantity = (item.quantity ?? 1) - 1
  }
}

/** Marks `id` Bonded. A no-op unless it's an unbonded Focus. */
function bondFocusById(state: ItemCatalog, id: UUID) {
  const item = state[id]
  if (!item || !isFocusData(item) || item.bonded) return
  item.bonded = true
}

/** Breaks `id`'s bond, dropping it out of any active state an unbonded Focus can't be in. */
function unbondFocusById(state: ItemCatalog, id: UUID) {
  const item = state[id]
  if (!item || !isFocusData(item) || !item.bonded) return
  const previousState = getItemState(item)
  item.bonded = false
  reconcileItemState(state, id, previousState)
}

export const ItemStateUtils = {
  relinkItem,
  removeItemById,
  removeItemTree,
  sellItemById,
  consumeItemById,
  bondFocusById,
  unbondFocusById,
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
    .addCase(sellItem, (state, action) => {
      sellItemById(state, action.payload.id, action.payload.sellAttachments)
    })
    .addCase(consumeItem, (state, action) => {
      consumeItemById(state, action.payload.id)
    })
    .addCase(bondFocus, (state, action) => {
      bondFocusById(state, action.payload.id)
    })
    .addCase(unbondFocus, (state, action) => {
      unbondFocusById(state, action.payload.id)
    })
    .addCase(setDamage, (state, action) => {
      const item = state[action.payload.itemId]
      if (!item || !isEntityWithDamage(item)) return
      item.damage[action.payload.track] = Math.max(0, action.payload.value)
    })
})
