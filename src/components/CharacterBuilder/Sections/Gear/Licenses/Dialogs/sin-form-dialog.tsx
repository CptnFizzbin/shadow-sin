import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { SinFormFields } from "#/components/CharacterBuilder/Sections/Gear/Licenses/Forms/sin-form-fields.tsx"
import { sinFieldMap, useSinForm } from "#/components/CharacterBuilder/Sections/Gear/Licenses/Forms/use-sin-form.tsx"
import type { SinData } from "#/lib/system/gear/sin-data.ts"

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
  const title = sin ? "Edit SIN" : "Create SIN"
  const form = useSinForm({ sin, onSubmit: onSave })

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
