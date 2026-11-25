import { createContext } from "react"

import type { UUID } from "#/common/uuid/uuidUtils.ts"
import type { ItemSelectionStore } from "#/state/itemSelection/itemSelectionStore.ts"

export interface ItemSelectionContextValue {
  store: ItemSelectionStore
  /** The ids of every Attachment under `itemId`, at any depth — auto-selected along with it. */
  getDescendantIds: (itemId: UUID) => UUID[]
}

/**
 * The gear list's selection, or `null` outside an `ItemSelectionProvider` — where Item cards never
 * enter selection mode. Read it through the hooks in `#/hooks/items/selection/`.
 */
export const ItemSelectionContext = createContext<ItemSelectionContextValue | null>(null)
