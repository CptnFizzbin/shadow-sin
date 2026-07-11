import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { AdeptPowerFormFields } from "#/components/runner/adeptPowers/form/adeptPowerFormFields.tsx"
import { useAdeptPowerForm } from "#/components/runner/adeptPowers/form/useAdeptPowerForm.ts"
import type { ControlledDialogProps } from "#/components/ui/dialog/controlledDialogProps.ts"
import { ControlledDialog, Dialog } from "#/components/ui/dialog/dialog.tsx"
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
    <ControlledDialog ctrl={ctrl} maxWidth="sm" onClosed={() => form.reset()}>

      <Dialog.Title>{title}</Dialog.Title>
      <Dialog.Content>
        <AdeptPowerFormFields form={form} />
      </Dialog.Content>
      <Dialog.Actions>
        <Stack direction="row" sx={{ justifyContent: "space-between", width: "100%" }}>
          <Box>
            {onDelete && (
              <Button
                color="error"
                onClick={() => {
                  onDelete()
                  ctrl.close()
                }}
              >
                Delete
              </Button>
            )}
          </Box>

          <Box>
            <Button onClick={() => ctrl.close()}>Cancel</Button>
            <Button variant="contained" onClick={() => form.handleSubmit()}>
              Save
            </Button>
          </Box>
        </Stack>
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
