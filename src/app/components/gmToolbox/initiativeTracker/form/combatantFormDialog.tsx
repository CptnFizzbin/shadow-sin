import Button from "@mui/material/Button"
import type { FC } from "react"

import type { ControlledDialogProps } from "#/components/ui/dialog/controlledDialogProps.ts"
import { ControlledDialog, Dialog } from "#/components/ui/dialog/dialog.tsx"
import type { CombatantInput } from "#/hooks/system/initiativeTracker/form/useCombatantForm.ts"
import { useCombatantForm } from "#/hooks/system/initiativeTracker/form/useCombatantForm.ts"
import { useDialog } from "#/hooks/ui/dialog/useDialog.tsx"

import { CombatantFormFields } from "./combatantFormFields.tsx"

const CombatantFormDialog: FC<ControlledDialogProps<CombatantInput>> = ({ ctrl }) => {
  const form = useCombatantForm({
    onSubmit: (combatant) => ctrl.close(combatant),
  })

  return (
    <ControlledDialog ctrl={ctrl} maxWidth="sm" onClose={false} onClosed={() => form.reset()}>
      <Dialog.Title>Add Unit</Dialog.Title>
      <Dialog.Content dividers>
        <CombatantFormFields form={form} />
      </Dialog.Content>
      <Dialog.Actions>
        <Button onClick={() => ctrl.close()}>Cancel</Button>
        <Button variant="contained" color="primary" onClick={() => form.handleSubmit()}>Add</Button>
      </Dialog.Actions>
    </ControlledDialog>
  )
}

export const useCombatantFormDialog = () => useDialog<CombatantInput>(
  (ctrl) => <CombatantFormDialog ctrl={ctrl} />,
)
