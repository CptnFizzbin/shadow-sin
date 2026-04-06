import type { UUID } from "node:crypto"

import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { ImplantFormFields } from "#/components/characterBuilder/sections/gear/cyberware/forms/implantFormFields.tsx"
import {
  implantFieldMap,
  useImplantForm,
} from "#/components/characterBuilder/sections/gear/cyberware/forms/useImplantForm.tsx"
import type { ImplantData } from "#/lib/system/gear/implantData.ts"

interface CyberwareFormDialogProps {
  open: boolean
  implant?: ImplantData
  parentId?: UUID
  onClose: () => void
  onClosed?: () => void
  onSave: (implant: ImplantData) => void
}

export const ImplantFormDialog: FC<CyberwareFormDialogProps> = ({
  open,
  implant,
  parentId,
  onClose,
  onClosed,
  onSave,
}) => {
  const editMode = !!implant
  const title = editMode ? `Edit Implant` : `Add Implant`

  const form = useImplantForm({ implant, parentId, onSubmit: onSave })

  return (
    <Dialog open={open} fullWidth onTransitionExited={onClosed}>
      <DialogTitle sx={{ padding: 1 }}>{title}</DialogTitle>

      <DialogContent sx={{ padding: 1 }}>
        <Stack gap={1} sx={{ padding: 1 }}>
          <ImplantFormFields form={form} fields={implantFieldMap} />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ padding: 1 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" onClick={form.handleSubmit} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}
