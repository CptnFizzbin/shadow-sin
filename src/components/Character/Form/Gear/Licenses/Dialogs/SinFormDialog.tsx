import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { SinFormFields } from "#/components/Character/Form/Gear/Licenses/Forms/SinFormFields.tsx"
import {
  sinFieldMap,
  useSinForm,
} from "#/components/Character/Form/Gear/Licenses/Forms/UseSinForm.tsx"
import type { SinData } from "#/lib/system/types/gear/SinData.ts"

interface SinEditDialogProps {
  open: boolean
  onClose: () => void
  onClosed?: () => void
  onSave: (sin: SinData) => void
  sin?: SinData
  allowReal?: boolean
}

export const SinFormDialog: FC<SinEditDialogProps> = ({
  open,
  sin,
  allowReal,
  onClose,
  onClosed,
  onSave,
}) => {
  const editMode = !!sin

  const form = useSinForm(
    editMode
      ? { mode: "edit", sin, onSubmit: onSave }
      : { mode: "create", allowReal, onSubmit: onSave },
  )

  const title = editMode ? "Edit SIN" : "Create SIN"

  return (
    <Dialog open={open} fullWidth onTransitionExited={onClosed}>
      <DialogTitle sx={{ padding: 1 }}>{title}</DialogTitle>

      <DialogContent sx={{ padding: 1 }}>
        <Stack gap={1} sx={{ padding: 1 }}>
          <SinFormFields
            form={form}
            allowReal={allowReal}
            fields={sinFieldMap}
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ padding: 1 }}>
        <Button color="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button
          type="submit"
          color="secondary"
          onClick={form.handleSubmit}
          variant="contained"
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}
