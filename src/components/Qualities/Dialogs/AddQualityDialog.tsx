import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import type { FC } from "react"
import {
  QualityFormFields,
  useQualityForm,
} from "#/components/Qualities/Form/index.ts"
import type { QualityData } from "#/lib/system/types/qualityData.ts"

export interface AddQualityDialogProps {
  open: boolean
  onClose: () => void
  onAdd: (quality: QualityData) => void
}

export const AddQualityDialog: FC<AddQualityDialogProps> = ({
  open,
  onClose,
  onAdd,
}) => {
  const form = useQualityForm({
    mode: "create",
    onSubmit: (quality) => {
      onAdd(quality)
      onClose()
    },
  })

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      onTransitionExited={() => form.reset()}
    >
      <DialogTitle>Add Quality</DialogTitle>
      <DialogContent sx={{ p: 1 }}>
        <QualityFormFields form={form} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>

        <Button variant="contained" onClick={() => form.handleSubmit()}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  )
}
