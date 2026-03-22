import { Stack } from "@mui/material"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import type { FC } from "react"

import { AdeptPowerFormFields } from "#/components/AdeptPowers/Form/AdeptPowerFormFields.tsx"
import { useAdeptPowerForm } from "#/components/AdeptPowers/Form/UseAdeptPowerForm.ts"
import { noop } from "#/lib/noop.ts"
import type { AdeptPowerData } from "#/lib/system/types/magic/adeptPowerData.ts"

export interface AdeptPowerFormDialogProps {
  open: boolean
  power?: AdeptPowerData
  onSave: (power: AdeptPowerData) => void
  onDelete?: () => void
  onClose: () => void
  onClosed?: () => void
}

export const AdeptPowerFormDialog: FC<AdeptPowerFormDialogProps> = ({
  open,
  power,
  onSave,
  onDelete,
  onClose,
  onClosed = noop,
}) => {
  const editMode = !!power

  const onSubmit = (power: AdeptPowerData) => {
    onSave(power)
    onClose()
  }

  const form = useAdeptPowerForm(
    editMode ? { mode: "edit", power, onSubmit } : { mode: "create", onSubmit },
  )

  const title = editMode ? "Edit Adept Power" : "Add Adept Power"

  return (
    <Dialog
      open={open}
      onTransitionExited={() => {
        form.reset()
        onClosed()
      }}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent sx={{ p: 1 }}>
        <AdeptPowerFormFields form={form} />
      </DialogContent>
      <DialogActions>
        <Stack justifyContent="space-between" direction="row" width="100%">
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
      </DialogActions>
    </Dialog>
  )
}
