import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { GearItemFormFields } from "#/components/characterBuilder/sections/gear/generic/forms/gearItemFormFields.tsx"
import {
  gearItemFieldMap,
  useItemForm,
} from "#/components/characterBuilder/sections/gear/generic/forms/useItemForm.tsx"
import { GearAcquireActions } from "#/components/gear/gearAcquireActions.tsx"
import type { GearType } from "#/lib/system/gearType.ts"
import type { ItemData } from "#/lib/system/itemData.ts"

interface GearItemFormDialogProps {
  open: boolean
  item?: ItemData
  gearType?: GearType
  onClose: () => void
  onClosed?: () => void
  onSave?: (item: ItemData) => void
  onAcquire?: (item: ItemData) => void
  onPurchase?: (item: ItemData) => void
  label?: string
}

export const GearItemFormDialog: FC<GearItemFormDialogProps> = ({
  open,
  item,
  gearType,
  onClose,
  onClosed,
  onSave,
  onAcquire,
  onPurchase,
  label = "Item",
}) => {
  const title = item ? `Edit ${label}` : `Add ${label}`
  const useAcquireMode = !!onAcquire && !!onPurchase

  const form = useItemForm({
    item,
    gearType,
    onSubmit: (submittedItem, meta) => {
      if (useAcquireMode) {
        if (meta.submitAction === "purchase") {
          onPurchase(submittedItem)
        } else {
          onAcquire(submittedItem)
        }
      } else {
        onSave?.(submittedItem)
      }
    },
  })

  return (
    <Dialog open={open} fullWidth onTransitionExited={onClosed}>
      <DialogTitle sx={{ padding: 1 }}>{title}</DialogTitle>

      <DialogContent sx={{ padding: 1 }}>
        <Stack gap={1} sx={{ padding: 1 }}>
          <GearItemFormFields form={form} fields={gearItemFieldMap} />
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
