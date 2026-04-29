import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { QualityFormFields } from "#/components/character/qualities/form/qualityFormFields.tsx"
import { useQualityForm } from "#/components/character/qualities/form/useQualityForm.ts"
import { useDialogApi } from "#/components/dialogs/api/dialogApiProvider.tsx"
import { noop } from "#/lib/noop.ts"
import type { QualityData } from "#/system/qualityData.ts"

interface QualityFormDialogProps {
  open: boolean
  quality?: QualityData
  onSave: (quality: QualityData) => void
  onDelete?: () => void
  onClose: () => void
  onClosed?: () => void
}

const QualityFormDialog: FC<QualityFormDialogProps> = ({
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
      slotProps={{
        transition: {
          onExited: () => {
            form.reset()
            onClosed()
          },
        },
      }}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent sx={{ p: 1 }}>
        <QualityFormFields form={form} />
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

interface UseQualityFormDialogProps {
  quality?: QualityData
  onSave: (quality: QualityData) => void
  onDelete?: () => void
}

export const useQualityFormDialog = () => {
  const dialogApi = useDialogApi()

  return {
    open: (props: UseQualityFormDialogProps) => dialogApi.open<void>(
      (dialogProps) => (
        <QualityFormDialog
          open={dialogProps.open}
          quality={props.quality}
          onSave={(quality) => {
            props.onSave(quality)
            dialogProps.onClose()
          }}
          onDelete={props.onDelete}
          onClose={() => dialogProps.onClose()}
          onClosed={dialogProps.onClosed}
        />
      ),
    ),
  }
}
