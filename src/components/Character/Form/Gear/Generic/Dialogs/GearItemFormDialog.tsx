import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { GearItemFormFields } from "#/components/Character/Form/Gear/Generic/Forms/GearItemFormFields.tsx"
import {
  gearItemFieldMap,
  useGearItemForm,
} from "#/components/Character/Form/Gear/Generic/Forms/UseGearItemForm.tsx"
import type { GearData } from "#/lib/system/types/gear/gearData.ts"

interface GearItemFormDialogProps {
  open: boolean
  item?: GearData
  onClose: () => void
  onClosed?: () => void
  onSave: (item: GearData) => void
  label?: string
}

export const GearItemFormDialog: FC<GearItemFormDialogProps> = ({
  open,
  item,
  onClose,
  onClosed,
  onSave,
  label = "Item",
}) => {
  const editMode = !!item
  const title = editMode ? `Edit ${label}` : `Add ${label}`

  const form = useGearItemForm(
    editMode
      ? { mode: "edit", item, onSubmit: onSave }
      : { mode: "create", onSubmit: onSave },
  )

  return (
    <Dialog open={open} fullWidth onTransitionExited={onClosed}>
      <DialogTitle sx={{ padding: 1 }}>{title}</DialogTitle>

      <DialogContent sx={{ padding: 1 }}>
        <Stack gap={1} sx={{ padding: 1 }}>
          <GearItemFormFields form={form} fields={gearItemFieldMap} />
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
