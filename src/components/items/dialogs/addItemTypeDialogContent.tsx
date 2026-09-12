import Button from "@mui/material/Button"
import type { FC } from "react"

import type { GearSection } from "#/components/runner/gearPage/gearSectionTypes.ts"
import { ControlledDialog, Dialog } from "#/components/ui/dialog/dialog.tsx"
import type { AnyDialogCtrl } from "#/components/ui/dialog/dialogCtrl.ts"
import { sectionHasSubtypeStep } from "#/system/items/addItemSelection.ts"

import { AddItemCategoryStep } from "./addItemCategoryStep.tsx"
import { AddItemSubtypeStep } from "./addItemSubtypeStep.tsx"
import { AddItemTypeStep, AddItemTypeWorkflow, useAddItemTypeWorkflow } from "./addItemTypeWorkflow.ts"

interface AddItemTypeDialogContentProps {
  ctrl: AnyDialogCtrl
}

/** Must render under `AddItemTypeWorkflow.Provider` — see `AddItemTypeDialog`. */
export const AddItemTypeDialogContent: FC<AddItemTypeDialogContentProps> = ({ ctrl }) => {
  const workflow = useAddItemTypeWorkflow()
  const section = workflow.data.section

  const handleSelectSection = (selected: GearSection) => {
    workflow.setData({ section: selected })
    if (sectionHasSubtypeStep(selected)) {
      workflow.next(AddItemTypeStep.Subtype)
    } else {
      ctrl.close({ section: selected })
    }
  }

  return (
    <ControlledDialog ctrl={ctrl}>
      <Dialog.Title>{section ? `Add ${section}` : "Add Item"}</Dialog.Title>

      <Dialog.Content>
        <AddItemTypeWorkflow.Step step={AddItemTypeStep.Category}>
          <AddItemCategoryStep onSelect={handleSelectSection} />
        </AddItemTypeWorkflow.Step>

        <AddItemTypeWorkflow.Step step={AddItemTypeStep.Subtype}>
          {section && sectionHasSubtypeStep(section) && (
            <AddItemSubtypeStep section={section} onSelect={(selection) => ctrl.close(selection)} />
          )}
        </AddItemTypeWorkflow.Step>
      </Dialog.Content>

      <Dialog.Actions>
        {!workflow.isFirstStep && <Button onClick={() => workflow.back()} sx={{ mr: "auto" }}>Back</Button>}
        <Button onClick={() => ctrl.close()}>Cancel</Button>
      </Dialog.Actions>
    </ControlledDialog>
  )
}
