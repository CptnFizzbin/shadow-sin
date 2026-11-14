import { createReducer } from "@reduxjs/toolkit"

import { ItemActions, setItem } from "#/state/runner/items/items.actions.ts"
import { ItemStateUtils } from "#/state/runner/items/items.state.ts"
import { RunnerActions } from "#/state/runner/runnerStore.actions.ts"
import { getItemState } from "#/system/formulas/items/itemStateRules.ts"
import type { ItemCatalog } from "#/system/model/items/itemUtils.ts"
import { getItemCatalog } from "#/system/model/runnerTraits.ts"

export const itemsRootReducer = createReducer<ItemCatalog>({}, ({ addCase }) => {
  // Copy `action.payload` rather than storing it by reference: the same action also reaches
  // `gearReducer` (`src/state/runner/items/items.state.ts`), and Immer freezes whatever a
  // produce call incorporates by reference into its output — so without the copy, whichever of
  // the two reducers runs second would be handed an already-frozen payload and throw the moment
  // `reconcileState`/`relinkItem` tried to write to it.
  addCase(ItemActions.addItem, (state, action) => {
    state[action.payload.id] = { ...action.payload }
    ItemStateUtils.relinkItem(state, state[action.payload.id])
    ItemStateUtils.reconcileState(state, action.payload.id, undefined)
  })

  addCase(setItem, (state, action) => {
    const previousState = state[action.payload.id] ? getItemState(state[action.payload.id]) : undefined
    state[action.payload.id] = { ...action.payload }
    ItemStateUtils.relinkItem(state, state[action.payload.id])
    ItemStateUtils.reconcileState(state, action.payload.id, previousState)
  })

  addCase(ItemActions.patchItem, (state, action) => {
    const item = state[action.payload.itemId]
    if (!item) return
    const previousState = getItemState(item)
    state[action.payload.itemId] = {
      ...item,
      ...action.payload.data,
    }
    ItemStateUtils.reconcileState(state, action.payload.itemId, previousState)
  })

  addCase(ItemActions.removeItem, (state, action) => {
    const { id, removeChildren } = action.payload
    if (removeChildren) {
      ItemStateUtils.removeItemTree(state, id)
    } else {
      ItemStateUtils.removeItemById(state, id)
    }
  })

  addCase(ItemActions.setState, (state, action) => {
    const item = state[action.payload.id]
    if (!item) return
    const previousState = getItemState(item)
    item.state = action.payload.state
    ItemStateUtils.reconcileState(state, action.payload.id, previousState)
  })

  addCase(RunnerActions.load, (_state, { payload }) => {
    return getItemCatalog(payload)
  })
})
