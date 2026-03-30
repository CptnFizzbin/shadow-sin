import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { GearItemFormFields } from "#/components/CharacterBuilder/Sections/Gear/Generic/Forms/GearItemFormFields.tsx"
import {
  gearItemFieldMap,
  useItemForm,
} from "#/components/CharacterBuilder/Sections/Gear/Generic/Forms/UseItemForm.tsx"
import type { ItemData } from "#/lib/system/ItemData.ts"

interface GearItemFormDialogProps {
  open: boolean
  item?: ItemData
  onClose: () => void
  onClosed?: () => void
  onSave: (item: ItemData) => void
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
  const title = item ? `Edit ${label}` : `Add ${label}`
  const form = useItemForm({ item, onSubmit: onSave })

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
