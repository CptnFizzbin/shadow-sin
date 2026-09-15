import { createReducer } from "@reduxjs/toolkit"

import { ItemActions, setItem } from "#/state/runner/items/items.actions.ts"
import { ItemStateUtils } from "#/state/runner/items/items.state.ts"
import { RunnerActions } from "#/state/runner/runnerStore.actions.ts"
import type { ItemCatalog } from "#/system/model/items/itemUtils.ts"
import { getItemCatalog } from "#/system/model/runnerTraits.ts"

export const itemsRootReducer = createReducer<ItemCatalog>({}, ({ addCase }) => {
  // Copy `action.payload` rather than storing it by reference: the same action also reaches
  // `gearReducer` (`src/state/runner/items/items.state.ts`), and Immer freezes whatever a
  // produce call incorporates by reference into its output — so without the copy, whichever of
  // the two reducers runs second would be handed an already-frozen payload and throw the moment
  // `reconcileEquippedForStash`/`relinkItem` tried to write to it.
  addCase(ItemActions.addItem, (state, action) => {
    state[action.payload.id] = { ...action.payload }
    ItemStateUtils.reconcileEquippedForStash(state[action.payload.id], false)
    ItemStateUtils.relinkItem(state, state[action.payload.id])
  })

  addCase(setItem, (state, action) => {
    const wasStashed = state[action.payload.id]?.stashed === true
    state[action.payload.id] = { ...action.payload }
    ItemStateUtils.reconcileEquippedForStash(state[action.payload.id], wasStashed)
    ItemStateUtils.relinkItem(state, state[action.payload.id])
  })

  addCase(ItemActions.patchItem, (state, action) => {
    const item = state[action.payload.itemId]
    if (!item) return
    const wasStashed = item.stashed === true
    state[action.payload.itemId] = {
      ...item,
      ...action.payload.data,
    }
    ItemStateUtils.reconcileEquippedForStash(state[action.payload.itemId], wasStashed)
  })

  addCase(ItemActions.removeItem, (state, action) => {
    const { id, removeChildren } = action.payload
    if (removeChildren) {
      ItemStateUtils.removeItemTree(state, id)
    } else {
      ItemStateUtils.removeItemById(state, id)
    }
  })

  addCase(ItemActions.setEquipped, (state, action) => {
    const item = state[action.payload.id]
    if (!item) return
    item.equipped = action.payload.equipped
  })

  addCase(ItemActions.setStashed, (state, action) => {
    const item = state[action.payload.id]
    if (!item) return
    const wasStashed = item.stashed === true
    item.stashed = action.payload.stashed
    ItemStateUtils.reconcileEquippedForStash(item, wasStashed)
  })

  addCase(RunnerActions.load, (_state, { payload }) => {
    return getItemCatalog(payload)
  })
})
