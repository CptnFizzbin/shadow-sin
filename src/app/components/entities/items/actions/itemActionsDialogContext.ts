import { createContext, useContext } from "react"

import type { ItemData } from "#/data/items/itemData.ts"

export interface ItemActionsDialogOpenOptions {
  item: ItemData
  /** Replaces the Edit action's default form, for callers with their own edit flow. */
  onEdit?: () => void
  /** Called once the Item has been sold or deleted, e.g. to leave its details page. */
  onRemoved?: () => void
}

export interface ItemActionsDialogContextValue {
  open: (options: ItemActionsDialogOpenOptions) => Promise<void>
}

/**
 * Kept separate from `ItemActionsDialogProvider`, which imports every Item type's dialogs: Item
 * cards open the actions dialog through this context instead, since importing the provider would
 * make every card depend on dialogs that themselves render cards.
 */
export const ItemActionsDialogContext = createContext<ItemActionsDialogContextValue | null>(null)

/**
 * The Item actions dialog, or `null` outside an `ItemActionsDialogProvider` or where a subtree has
 * turned it off (e.g. cards for unsaved Items in an edit form).
 */
export const useItemActionsDialogContext = (): ItemActionsDialogContextValue | null =>
  useContext(ItemActionsDialogContext)
