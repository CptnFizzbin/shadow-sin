import { Stack } from "@mui/material"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import type { FC } from "react"
import { QualityFormFields } from "#/components/Qualities/Form/index.ts"
import { useQualityForm } from "#/components/Qualities/Form/UseQualityForm.ts"
import { noop } from "#/lib/noop.ts"
import type { QualityData } from "#/lib/system/types/qualityData.ts"

export interface QualityDialogProps {
  quality: QualityData
  open: boolean
  onSave: (updated: QualityData) => void
  onDelete?: () => void
  onClose: () => void
  onClosed?: () => void
}

export const EditQualityDialog: FC<QualityDialogProps> = ({
  quality,
  open,
  onSave,
  onDelete,
  onClose,
  onClosed = noop,
}) => {
  const form = useQualityForm({
    mode: "edit",
    quality: quality,
    onSubmit: (quality) => {
      onSave(quality)
      onClose()
    },
  })

  return (
    <Dialog
      open={open}
      onTransitionExited={() => {
        form.reset()
        onClosed()
      }}
      fullWidth
    >
      <DialogTitle>
        {quality.type === "positive" ? "Positive Quality" : "Negative Quality"}
      </DialogTitle>
      <DialogContent sx={{ p: 1 }}>
        <QualityFormFields form={form} />
      </DialogContent>
      <DialogActions>
        <Stack justifyContent={"space-between"} direction="row" width="100%">
          <Box>
            {onDelete && (
              <Button color="error" onClick={onDelete}>
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
