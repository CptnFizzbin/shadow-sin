import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { AdeptPowerFormFields } from "#/components/character/adeptPowers/form/adeptPowerFormFields.tsx"
import { useAdeptPowerForm } from "#/components/character/adeptPowers/form/useAdeptPowerForm.ts"
import { useDialogApi } from "#/components/dialogs/api/dialogApiProvider.tsx"
import { Dialog } from "#/components/ui/dialog/dialog.tsx"
import { noop } from "#/lib/noop.ts"
import type { AdeptPowerData } from "#/system/magic/adeptPowerData.ts"

interface AdeptPowerFormDialogProps {
  open: boolean
  power?: AdeptPowerData
  onSave: (power: AdeptPowerData) => void
  onDelete?: () => void
  onClose: () => void
  onClosed?: () => void
}

const AdeptPowerFormDialog: FC<AdeptPowerFormDialogProps> = ({
  open,
  power,
  onSave,
  onDelete,
  onClose,
  onClosed = noop,
}) => {
  const editMode = !!power

  const onSubmit = (nextPower: AdeptPowerData) => {
    onSave(nextPower)
    onClose()
  }

  const form = useAdeptPowerForm(
    editMode ? { mode: "edit", power, onSubmit } : { mode: "create", onSubmit },
  )

  const title = editMode ? "Edit Adept Power" : "Add Adept Power"

  const handleClosed = () => {
    form.reset()
    onClosed()
  }

  return (
    <Dialog
      open={open}
      onClosed={handleClosed}
      maxWidth="sm"
    >

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
                  onClose()
                }}
              >
                Delete
              </Button>
            )}
          </Box>

          <Box>
            <Button onClick={onClose}>Cancel</Button>
            <Button variant="contained" onClick={() => form.handleSubmit()}>
              Save
            </Button>
          </Box>
        </Stack>
      </Dialog.Actions>
    </Dialog>
  )
}

export interface UseAdeptPowerFormDialogProps {
  power?: AdeptPowerData
  onDelete?: () => void
}

export const useAdeptPowerFormDialog = () => {
  const dialogApi = useDialogApi()

  return {
    open: (props?: UseAdeptPowerFormDialogProps) => dialogApi.open<AdeptPowerData>(
      (dialogProps) => (
        <AdeptPowerFormDialog
          {...dialogProps}
          power={props?.power}
          onDelete={props?.onDelete}
          onSave={(power) => dialogProps.onClose(power)}
        />
      ),
    ),
  }
}
