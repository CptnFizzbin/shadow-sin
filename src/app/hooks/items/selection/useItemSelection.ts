import { useContext, useEffect } from "react"

import { ItemSelectionContext } from "#/app/components/entities/items/selection/itemSelectionContext.ts"
import type { UUID } from "#/common/uuid/uuidUtils.ts"
import type { ItemSelectionState, ItemSelectionStore } from "#/state/itemSelection/itemSelectionStore.ts"
import { createItemSelectionStore, ItemSelectionActions } from "#/state/itemSelection/itemSelectionStore.ts"
import { useSelector } from "#/state/reduxToolkit/useSelector.ts"

// Read in place of a missing provider so the hooks below can always subscribe to a store. Nothing
// outside a provider offers a way to start selecting, so there selection mode stays off.
const inactiveStore = createItemSelectionStore()

function useItemSelectionStore(): { store: ItemSelectionStore, isAvailable: boolean, getDescendantIds: (itemId: UUID) => UUID[] } {
  const context = useContext(ItemSelectionContext)
  return {
    store: context?.store ?? inactiveStore,
    isAvailable: !!context,
    getDescendantIds: context?.getDescendantIds ?? (() => []),
  }
}

function useItemSelectionState<TSelected>(selector: (state: ItemSelectionState) => TSelected): TSelected {
  return useSelector(useItemSelectionStore().store, selector)
}

export interface ItemSelectionMode {
  /** Whether a gear list's selection is reachable here at all (i.e. inside an `ItemSelectionProvider`). */
  isAvailable: boolean
  isSelecting: boolean
  selectedIds: readonly UUID[]
  start: () => void
  exit: () => void
}

/** The gear list's selection mode: whether it's on, what's selected, and switching it on or off. */
export function useItemSelectionMode(): ItemSelectionMode {
  const { store, isAvailable } = useItemSelectionStore()
  const isSelecting = useItemSelectionState((state) => state.isSelecting)
  const selectedIds = useItemSelectionState((state) => state.selectedIds)

  return {
    isAvailable,
    isSelecting,
    selectedIds,
    start: () => store.dispatch(ItemSelectionActions.start()),
    exit: () => store.dispatch(ItemSelectionActions.exit()),
  }
}

export interface ItemSelectionToggle {
  isSelected: boolean
  /** Selects the Item and its Attachments, or deselects them all when it's already selected. */
  toggle: () => void
}

/**
 * The selection checkbox state for one Item, or `undefined` while selection mode is off — the
 * signal for its card to behave normally.
 */
export function useItemSelectionToggle(itemId: UUID): ItemSelectionToggle | undefined {
  const { store, getDescendantIds } = useItemSelectionStore()
  const isSelecting = useItemSelectionState((state) => state.isSelecting)
  const isSelected = useItemSelectionState((state) => state.selectedIds.includes(itemId))

  if (!isSelecting) return undefined

  return {
    isSelected,
    toggle: () => store.dispatch(ItemSelectionActions.toggle({
      itemId,
      descendantIds: getDescendantIds(itemId),
    })),
  }
}

/** Turns selection mode off when the calling component unmounts. */
export function useEndItemSelectionOnUnmount(): void {
  const { store } = useItemSelectionStore()
  useEffect(() => () => {
    store.dispatch(ItemSelectionActions.exit())
  }, [store])
}
