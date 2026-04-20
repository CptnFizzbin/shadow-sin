import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { ArmorFormFields } from "#/components/gear/armor/forms/armorFormFields.tsx"
import {
  armorFieldMap,
  useArmorForm,
} from "#/components/gear/armor/forms/useArmorForm.tsx"
import { GearAcquireActions } from "#/components/gear/gearAcquireActions.tsx"
import { useItemFormSubmit } from "#/components/gear/useItemFormSubmit.ts"
import type { ArmorData } from "#/system/gear/armorData.ts"

interface ArmorFormDialogProps {
  open: boolean
  armor?: ArmorData
  onClose: () => void
  onClosed?: () => void
  onSave: (armor: ArmorData) => void
}

export const ArmorFormDialog: FC<ArmorFormDialogProps> = ({
  open,
  armor,
  onClose,
  onClosed,
  onSave,
}) => {
  const title = armor ? "Edit Armor" : "Add Armor"

  const { handleSubmit, isAcquireMode } = useItemFormSubmit({
    mode: armor ? "edit" : "create",
    onSave,
    getItemCost: (a) => a.cost ?? 0,
  })

  const form = useArmorForm({
    armor,
    onSubmit: handleSubmit,
  })

  return (
    <Dialog open={open} fullWidth onTransitionExited={onClosed}>
      <DialogTitle sx={{ padding: 1 }}>{title}</DialogTitle>

      <DialogContent sx={{ padding: 1 }}>
        <Stack sx={{ gap: 1, padding: 1 }}>
          <ArmorFormFields form={form} fields={armorFieldMap} />
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
