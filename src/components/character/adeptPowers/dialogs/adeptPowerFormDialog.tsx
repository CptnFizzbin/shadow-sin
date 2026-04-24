import { Stack } from "@mui/material"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import type { FC } from "react"

import { AdeptPowerFormFields } from "#/components/character/adeptPowers/form/adeptPowerFormFields.tsx"
import { useAdeptPowerForm } from "#/components/character/adeptPowers/form/useAdeptPowerForm.ts"
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

export const AdeptPowerFormDialog: FC<AdeptPowerFormDialogProps> = ({
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
      slotProps={{ transition: { onExited: handleClosed } }}
      fullWidth
      maxWidth="sm"
    >

      <DialogTitle>{title}</DialogTitle>
      <DialogContent sx={{ p: 1 }}>
        <AdeptPowerFormFields form={form} />
      </DialogContent>
      <DialogActions>
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
      </DialogActions>
    </Dialog>
  )
}
