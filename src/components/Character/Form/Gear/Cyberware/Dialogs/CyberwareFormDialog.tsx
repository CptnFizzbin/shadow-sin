import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { ImplantFormFields } from "#/components/Character/Form/Gear/Cyberware/Forms/ImplantFormFields.tsx"
import type { ImplantFormState } from "#/components/Character/Form/Gear/Cyberware/Forms/ImplantFormState.ts"
import {
  implantFieldMap,
  useImplantForm,
} from "#/components/Character/Form/Gear/Cyberware/Forms/UseImplantForm.tsx"

interface CyberwareFormDialogProps {
  open: boolean
  implant?: ImplantFormState
  onClose: () => void
  onClosed?: () => void
  onSave: (implant: ImplantFormState) => void
  label?: string
}

export const CyberwareFormDialog: FC<CyberwareFormDialogProps> = ({
  open,
  implant,
  onClose,
  onClosed,
  onSave,
  label = "Implant",
}) => {
  const editMode = !!implant
  const title = editMode ? `Edit ${label}` : `Add ${label}`

  const form = useImplantForm(
    editMode
      ? { mode: "edit", implant, onSubmit: onSave }
      : { mode: "create", onSubmit: onSave },
  )

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
