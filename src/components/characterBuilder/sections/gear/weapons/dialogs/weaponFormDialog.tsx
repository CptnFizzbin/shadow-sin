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
} from "#/components/characterBuilder/sections/gear/weapons/forms/useWeaponForm.tsx"
import { WeaponFormFields } from "#/components/characterBuilder/sections/gear/weapons/forms/weaponFormFields.tsx"
import { GearAcquireActions } from "#/components/gear/gearAcquireActions.tsx"
import type { WeaponData } from "#/lib/system/gear/weaponData.ts"

interface WeaponFormDialogProps {
  open: boolean
  weapon?: WeaponData
  onClose: () => void
  onClosed?: () => void
  onSave?: (weapon: WeaponData) => void
  onAcquire?: (weapon: WeaponData) => void
  onPurchase?: (weapon: WeaponData) => void
}

export const WeaponFormDialog: FC<WeaponFormDialogProps> = ({
  open,
  weapon,
  onClose,
  onClosed,
  onSave,
  onAcquire,
  onPurchase,
}) => {
  const title = weapon ? "Edit Weapon" : "Add Weapon"
  const useAcquireMode = !!onAcquire && !!onPurchase

  const form = useWeaponForm({
    weapon,
    onSubmit: (submittedWeapon, meta) => {
      if (useAcquireMode) {
        if (meta.submitAction === "purchase") {
          onPurchase(submittedWeapon)
        } else {
          onAcquire(submittedWeapon)
        }
      } else {
        onSave?.(submittedWeapon)
      }
    },
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
        {useAcquireMode
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
