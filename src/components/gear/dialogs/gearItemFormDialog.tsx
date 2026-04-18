import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { GearItemFormFields } from "#/components/gear/forms/gearItemFormFields.tsx"
import {
  gearItemFieldMap,
  useItemForm,
} from "#/components/gear/forms/useItemForm.tsx"
import { GearAcquireActions } from "#/components/gear/gearAcquireActions.tsx"
import { useItemFormSubmit } from "#/components/gear/useItemFormSubmit.ts"
import type { ItemData } from "#/lib/system/itemData.ts"
import type { ItemType } from "#/lib/system/itemType.ts"

interface GearItemFormDialogProps {
  open: boolean
  item?: ItemData
  itemType?: ItemType
  onClose: () => void
  onClosed?: () => void
  onSave: (item: ItemData) => void
  label?: string
}

export const GearItemFormDialog: FC<GearItemFormDialogProps> = ({
  open,
  item,
  itemType,
  onClose,
  onClosed,
  onSave,
  label = "Item",
}) => {
  const title = item ? `Edit ${label}` : `Add ${label}`

  const { handleSubmit, isAcquireMode } = useItemFormSubmit({
    mode: item ? "edit" : "create",
    onSave,
    getItemCost: (i) => i.cost ?? 0,
  })

  const form = useItemForm({
    item,
    itemType,
    onSubmit: handleSubmit,
  })

  return (
    <Dialog open={open} fullWidth onTransitionExited={onClosed}>
      <DialogTitle sx={{ padding: 1 }}>{title}</DialogTitle>

      <DialogContent sx={{ padding: 1 }}>
        <Stack sx={{ gap: 1, padding: 1 }}>
          <GearItemFormFields form={form} fields={gearItemFieldMap} />
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
