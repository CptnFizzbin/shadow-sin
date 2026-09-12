import { createContext, useContext } from "react"

import { OutOfContextError } from "#/lib/errors/outOfContextError.ts"
import type { UUID } from "#/lib/uuidUtils.ts"

export interface AddItemDialogOpenOptions {
  /**
   * Pre-attaches the new item to an existing item (e.g. an accessory added from its parent's
   * edit dialog or details page) — forces the resolved type's "Attached To" section on and
   * pre-fills it, skipping past the question of what it's attached to. Ignored by SIN/License,
   * which use their own dedicated SIN-covers-License relationship instead.
   */
  parentId?: UUID
}

export interface AddItemDialogContextValue {
  open: (options?: AddItemDialogOpenOptions) => Promise<void>
}

/**
 * Kept deliberately separate from `useAddItemDialog` (which imports every concrete gear
 * type's `*FormDialog`) — those dialogs, and `ItemDialog` they all share, need to be able to
 * open the Add Item workflow (e.g. from `ItemDialog`'s Subitems tab) without importing the
 * hook that imports them, which would be a dependency cycle. This context is the layer they
 * depend on instead; `AddItemDialogProvider` is the only place that bridges the two.
 */
export const AddItemDialogContext = createContext<AddItemDialogContextValue | null>(null)

/** Must be used within an {@link AddItemDialogContext.Provider} (see `AddItemDialogProvider`). */
export const useAddItemDialogContext = (): AddItemDialogContextValue => {
  const value = useContext(AddItemDialogContext)
  if (!value) throw new OutOfContextError("useAddItemDialogContext", "AddItemDialogProvider")
  return value
}
