import Button from "@mui/material/Button"
import type { FC } from "react"
import { useState } from "react"

import type { GearSection } from "#/components/runner/gearPage/gearSectionTypes.ts"
import { ControlledDialog, Dialog } from "#/components/ui/dialog/dialog.tsx"
import type { AnyDialogCtrl } from "#/components/ui/dialog/dialogCtrl.ts"
import { useDialog } from "#/hooks/ui/dialog/useDialog.tsx"
import type { AddItemSelection } from "#/system/items/addItemSelection.ts"
import { sectionHasSubtypeStep } from "#/system/items/addItemSelection.ts"

import { AddItemCategoryStep } from "./addItemCategoryStep.tsx"
import { AddItemSubtypeStep } from "./addItemSubtypeStep.tsx"

interface AddItemTypeDialogProps {
  ctrl: AnyDialogCtrl
}

/**
 * Steps 1 and 2 of the Add Item workflow — Select Type, then Select Subtype where the
 * chosen category has more than one concrete gear type. Resolves to an `AddItemSelection`
 * that the caller uses to open that type's own Enter Stats / Select Effects / Finalize dialog.
 */
export const AddItemTypeDialog: FC<AddItemTypeDialogProps> = ({ ctrl }) => {
  const [section, setSection] = useState<GearSection | null>(null)

  const handleSelectSection = (selected: GearSection) => {
    if (sectionHasSubtypeStep(selected)) {
      setSection(selected)
    } else {
      ctrl.close({ section: selected })
    }
  }

  return (
    <ControlledDialog ctrl={ctrl}>
      <Dialog.Title>{section ? `Add ${section}` : "Add Item"}</Dialog.Title>

      <Dialog.Content>
        {section && sectionHasSubtypeStep(section)
          ? <AddItemSubtypeStep section={section} onSelect={(selection) => ctrl.close(selection)} />
          : <AddItemCategoryStep onSelect={handleSelectSection} />}
      </Dialog.Content>

      <Dialog.Actions>
        {section && <Button onClick={() => setSection(null)} sx={{ mr: "auto" }}>Back</Button>}
        <Button onClick={() => ctrl.close()}>Cancel</Button>
      </Dialog.Actions>
    </ControlledDialog>
  )
}

export const useAddItemTypeDialog = () => useDialog<AddItemSelection, void>(
  (ctrl) => <AddItemTypeDialog ctrl={ctrl} />,
)
