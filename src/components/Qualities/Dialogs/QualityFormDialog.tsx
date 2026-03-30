import { Stack } from "@mui/material"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import type { FC } from "react"

import { QualityFormFields } from "#/components/Qualities/Form/QualityFormFields.tsx"
import { useQualityForm } from "#/components/Qualities/Form/UseQualityForm.ts"
import { noop } from "#/lib/noop.ts"
import type { QualityData } from "#/lib/system/qualityData.ts"

export interface QualityFormDialogProps {
  open: boolean
  quality?: QualityData
  onSave: (quality: QualityData) => void
  onDelete?: () => void
  onClose: () => void
  onClosed?: () => void
}

export const QualityFormDialog: FC<QualityFormDialogProps> = ({
  open,
  quality,
  onSave,
  onDelete,
  onClose,
  onClosed = noop,
}) => {
  const editMode = !!quality

  const form = useQualityForm({
    quality,
    onSubmit: (q) => onSave(q),
  })

  const title = editMode ? "Edit Quality" : "Add Quality"

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
        <QualityFormFields form={form} />
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
