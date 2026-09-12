import type { FC } from "react"

import type { AnyDialogCtrl } from "#/components/ui/dialog/dialogCtrl.ts"
import { useDialog } from "#/hooks/ui/dialog/useDialog.tsx"
import type { AddItemSelection } from "#/system/items/addItemSelection.ts"

import { AddItemTypeDialogContent } from "./addItemTypeDialogContent.tsx"
import { AddItemTypeStep, AddItemTypeWorkflow } from "./addItemTypeWorkflow.ts"

interface AddItemTypeDialogProps {
  ctrl: AnyDialogCtrl
}

/**
 * Steps 1 and 2 of the Add Item workflow — Select Type, then Select Subtype where the
 * chosen category has more than one concrete gear type. Resolves to an `AddItemSelection`
 * that the caller uses to open that type's own Enter Stats / Select Effects / Finalize dialog.
 * Wraps `AddItemTypeDialogContent` in the `AddItemTypeWorkflow.Provider` it needs.
 */
export const AddItemTypeDialog: FC<AddItemTypeDialogProps> = ({ ctrl }) => (
  <AddItemTypeWorkflow.Provider initialStep={AddItemTypeStep.Category} initialData={{ section: null }}>
    <AddItemTypeDialogContent ctrl={ctrl} />
  </AddItemTypeWorkflow.Provider>
)

export const useAddItemTypeDialog = () => useDialog<AddItemSelection, void>(
  (ctrl) => <AddItemTypeDialog ctrl={ctrl} />,
)
