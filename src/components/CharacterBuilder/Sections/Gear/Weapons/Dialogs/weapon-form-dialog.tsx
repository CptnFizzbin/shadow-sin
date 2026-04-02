import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import Stack from "@mui/material/Stack"
import type { FC } from "react"

import {
  weaponFieldMap,
  useWeaponForm,
} from '#/components/CharacterBuilder/Sections/Gear/Weapons/Forms/use-weapon-form.tsx"
import { WeaponFormFields } from '#/components/CharacterBuilder/Sections/Gear/Weapons/Forms/weapon-form-fields.tsx"
import type { WeaponData } from "#/lib/system/gear/weaponData.ts"

interface WeaponFormDialogProps {
  open: boolean
  weapon?: WeaponData
  onClose: () => void
  onClosed?: () => void
  onSave: (weapon: WeaponData) => void
}

export const WeaponFormDialog: FC<WeaponFormDialogProps> = ({
  open,
  weapon,
  onClose,
  onClosed,
  onSave,
}) => {
  const title = weapon ? "Edit Weapon" : "Add Weapon"

  const form = useWeaponForm({ weapon, onSubmit: onSave })

  return (
    <Dialog open={open} fullWidth onTransitionExited={onClosed}>
      <DialogTitle sx={{ padding: 1 }}>{title}</DialogTitle>

      <DialogContent sx={{ padding: 1 }}>
        <Stack gap={1} sx={{ padding: 1 }}>
          <WeaponFormFields form={form} fields={weaponFieldMap} />
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
