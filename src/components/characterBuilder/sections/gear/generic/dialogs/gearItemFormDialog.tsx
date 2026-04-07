import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import Stack from "@mui/material/Stack"
import type { FC } from "react"
import { useRef } from "react"

import { GearItemFormFields } from "#/components/characterBuilder/sections/gear/generic/forms/gearItemFormFields.tsx"
import {
  gearItemFieldMap,
  useItemForm,
} from "#/components/characterBuilder/sections/gear/generic/forms/useItemForm.tsx"
import { GearAcquireActions } from "#/components/gear/gearAcquireActions.tsx"
import type { ItemData } from "#/lib/system/itemData.ts"

interface GearItemFormDialogProps {
  open: boolean
  item?: ItemData
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
  onClose,
  onClosed,
  onSave,
  onAcquire,
  onPurchase,
  label = "Item",
}) => {
  const title = item ? `Edit ${label}` : `Add ${label}`
  const submitModeRef = useRef<"acquire" | "purchase" | "save">("save")

  const form = useItemForm({
    item,
    onSubmit: (submittedItem) => {
      if (onAcquire && onPurchase) {
        if (submitModeRef.current === "purchase") {
          onPurchase(submittedItem)
        } else {
          onAcquire(submittedItem)
        }
      } else {
        onSave?.(submittedItem)
      }
    },
  })

  const useAcquireMode = !!onAcquire && !!onPurchase

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
                    onAcquire={() => {
                      submitModeRef.current = "acquire"
                      form.handleSubmit()
                    }}
                    onPurchase={() => {
                      submitModeRef.current = "purchase"
                      form.handleSubmit()
                    }}
                  />
                )}
              </form.Subscribe>
            )
          : (
              <>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                  type="submit"
                  onClick={() => {
                    submitModeRef.current = "save"
                    form.handleSubmit()
                  }}
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
