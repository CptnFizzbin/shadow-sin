import type { FC, PropsWithChildren } from "react"

import { AddItemDialogContext } from "#/contexts/items/addItemDialogContext.ts"
import { useAddItemDialog } from "#/hooks/items/dialogs/useAddItemDialog.tsx"

/**
 * Provides the Add Item workflow to the subtree via `AddItemDialogContext` and renders its
 * dialogs once. Mount high enough to cover every place that can trigger it — the Gear page's
 * "Add Item" button and `ItemDialog`'s Subitems tab both read from this context rather than
 * calling `useAddItemDialog` themselves, to avoid the dependency cycle that would create (see
 * `addItemDialogContext.ts`).
 */
export const AddItemDialogProvider: FC<PropsWithChildren> = ({ children }) => {
  const addItemDialog = useAddItemDialog()

  return (
    <AddItemDialogContext.Provider value={{ open: addItemDialog.open }}>
      {children}
      {addItemDialog.outlet}
    </AddItemDialogContext.Provider>
  )
}
