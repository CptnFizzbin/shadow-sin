import type { FC } from "react"

import { AdeptPowerFormFields } from "#/components/runner/adeptPowers/form/adeptPowerFormFields.tsx"
import { useAdeptPowerForm } from "#/components/runner/adeptPowers/form/useAdeptPowerForm.ts"
import type { ControlledDialogProps } from "#/components/ui/dialog/controlledDialogProps.ts"
import { ControlledDialog, Dialog } from "#/components/ui/dialog/dialog.tsx"
import { FormDialogActions } from "#/components/ui/dialog/formDialogActions.tsx"
import { useDialog } from "#/components/ui/dialog/useDialog.tsx"
import type { AdeptPowerData } from "#/system/powers/adeptPowerData.ts"

interface AdeptPowerFormDialogProps extends ControlledDialogProps<AdeptPowerData> {
  power?: AdeptPowerData
  onDelete?: () => void
}

const AdeptPowerFormDialog: FC<AdeptPowerFormDialogProps> = ({
  ctrl,
  power,
  onDelete,
}) => {
  const editMode = !!power

  const form = useAdeptPowerForm(
    editMode
      ? { mode: "edit", power, onSubmit: (nextPower) => ctrl.close(nextPower) }
      : { mode: "create", onSubmit: (nextPower) => ctrl.close(nextPower) },
  )

  const title = editMode ? "Edit Adept Power" : "Add Adept Power"

  return (
    <ControlledDialog ctrl={ctrl} maxWidth="sm" onClose={false} onClosed={() => form.reset()}>

      <Dialog.Title>{title}</Dialog.Title>
      <Dialog.Content>
        <AdeptPowerFormFields form={form} />
      </Dialog.Content>
      <Dialog.Actions>
        <FormDialogActions
          onCancel={() => ctrl.close()}
          onSave={() => form.handleSubmit()}
          onDelete={onDelete && (() => {
            onDelete()
            ctrl.close()
          })}
        />
      </Dialog.Actions>
    </ControlledDialog>
  )
}

interface UseAdeptPowerFormDialogProps {
  power?: AdeptPowerData
  onDelete?: () => void
}

export const useAdeptPowerFormDialog = () => useDialog<AdeptPowerData, UseAdeptPowerFormDialogProps | undefined>(
  (ctrl, props) => (
    <AdeptPowerFormDialog
      ctrl={ctrl}
      power={props?.power}
      onDelete={props?.onDelete}
    />
  ),
)
