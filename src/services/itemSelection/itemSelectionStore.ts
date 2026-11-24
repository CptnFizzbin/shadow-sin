import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "@reduxjs/toolkit"

import type { CompatStore } from "#/integrations/reduxToolkit/compatStore.ts"
import { createCompatStore } from "#/integrations/reduxToolkit/compatStore.ts"
import type { UUID } from "#/utils/uuidUtils.ts"

/** Which Items the Player has picked in the gear list's selection mode. */
export interface ItemSelectionState {
  /** Whether selection mode is on: cards show checkboxes and the bulk action bar replaces the usual bottom bar. */
  isSelecting: boolean
  selectedIds: readonly UUID[]
}

const initialState: ItemSelectionState = { isSelecting: false, selectedIds: [] }

const itemSelectionSlice = createSlice({
  name: "itemSelection",
  initialState,
  reducers: {
    start: () => ({ isSelecting: true, selectedIds: [] }),
    exit: () => initialState,
    /**
     * Selects `itemId` along with `descendantIds` (its Attachments), or deselects all of them when
     * `itemId` is already selected. Each Attachment stays individually toggleable afterwards.
     */
    toggle: (state, action: PayloadAction<{ itemId: UUID, descendantIds: readonly UUID[] }>) => {
      const { itemId, descendantIds } = action.payload
      const affectedIds = new Set([itemId, ...descendantIds])
      const remainingIds = state.selectedIds.filter((id) => !affectedIds.has(id))
      state.selectedIds = state.selectedIds.includes(itemId) ? remainingIds : [...remainingIds, ...affectedIds]
    },
  },
})

export const ItemSelectionActions = itemSelectionSlice.actions

export type ItemSelectionStore = CompatStore<ItemSelectionState>

/** A fresh selection store, with selection mode off. One per gear list. */
export function createItemSelectionStore(): ItemSelectionStore {
  return createCompatStore(initialState, itemSelectionSlice.reducer)
}
