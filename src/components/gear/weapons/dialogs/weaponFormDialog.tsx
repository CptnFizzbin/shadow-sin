import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { GearAcquireActions } from "#/components/gear/gearAcquireActions.tsx"
import { useItemFormSubmit } from "#/components/gear/useItemFormSubmit.ts"
import {
  weaponFieldMap,
  useWeaponForm,
} from "#/components/gear/weapons/forms/useWeaponForm.tsx"
import { WeaponFormFields } from "#/components/gear/weapons/forms/weaponFormFields.tsx"
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

  const { handleSubmit, isAcquireMode } = useItemFormSubmit({
    mode: weapon ? "edit" : "create",
    onSave,
    getItemCost: (w) => w.cost ?? 0,
  })

  const form = useWeaponForm({
    weapon,
    onSubmit: handleSubmit,
  })

  return (
    <Dialog open={open} fullWidth onTransitionExited={onClosed}>
      <DialogTitle sx={{ padding: 1 }}>{title}</DialogTitle>

      <DialogContent sx={{ padding: 1 }}>
        <Stack gap={1} sx={{ padding: 1 }}>
          <WeaponFormFields form={form} fields={weaponFieldMap} />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ padding: 1 }}>
        {isAcquireMode
          ? (
              <form.Subscribe selector={(state) => state.values.cost}>
                {(cost) => (
                  <GearAcquireActions
                    cost={cost ?? 0}
                    onClose={onClose}
                    onAcquire={() => form.handleSubmit({ submitAction: "acquire" })}
                    onPurchase={() => form.handleSubmit({ submitAction: "purchase" })}
                  />
                )}
              </form.Subscribe>
            )
          : (
              <>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                  type="submit"
                  onClick={() => form.handleSubmit()}
                  variant="contained"
                >
                  Save
                </Button>
              </>
            )}
      </DialogActions>
    </Dialog>
  )
}
