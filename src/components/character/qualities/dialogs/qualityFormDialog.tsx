import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { QualityFormFields } from "#/components/character/qualities/form/qualityFormFields.tsx"
import { useQualityForm } from "#/components/character/qualities/form/useQualityForm.ts"
import { useDialogApi } from "#/components/dialogs/api/dialogApiProvider.tsx"
import { Dialog } from "#/components/ui/dialog/dialog.tsx"
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
      maxWidth="sm"
      onClosed={() => {
        form.reset()
        onClosed()
      }}
    >
      <Dialog.Title>{title}</Dialog.Title>
      <Dialog.Content>
        <QualityFormFields form={form} />
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

interface UseQualityFormDialogProps {
  quality?: QualityData
  onSave: (quality: QualityData) => void
  onDelete?: () => void
}

export const useQualityFormDialog = () => {
  const dialogApi = useDialogApi()

  return {
    open: (props: UseQualityFormDialogProps) => dialogApi.open<void>(
      (ctrl, open) => (
        <QualityFormDialog
          open={open}
          quality={props.quality}
          onSave={(quality) => {
            props.onSave(quality)
            ctrl.close()
          }}
          onDelete={props.onDelete}
          onClose={() => ctrl.close()}
          onClosed={() => ctrl.onClosed()}
        />
      ),
    ),
  }
}
