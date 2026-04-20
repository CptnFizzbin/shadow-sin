import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { GearAcquireActions } from "#/components/gear/gearAcquireActions.tsx"
import { useItemFormSubmit } from "#/components/gear/useItemFormSubmit.ts"
import { useVehicleForm, vehicleFieldMap } from "#/components/vehicles/forms/useVehicleForm.tsx"
import { VehicleFormFields } from "#/components/vehicles/forms/vehicleFormFields.tsx"
import type { VehicleData } from "#/system/gear/vehicleData.ts"
import { VehicleCategory } from "#/system/gear/vehicleData.ts"

interface VehicleFormDialogProps {
  open: boolean
  vehicle?: VehicleData
  vehicleCategory?: VehicleCategory
  onClose: () => void
  onClosed?: () => void
  onSave: (vehicle: VehicleData) => void
}

export const VehicleFormDialog: FC<VehicleFormDialogProps> = ({
  open,
  vehicle,
  vehicleCategory,
  onClose,
  onClosed,
  onSave,
}) => {
  const { handleSubmit, isAcquireMode } = useItemFormSubmit({
    mode: vehicle ? "edit" : "create",
    onSave,
    getItemCost: (v) => v.cost ?? 0,
  })

  const form = useVehicleForm({
    vehicle,
    vehicleCategory,
    onSubmit: handleSubmit,
  })

  return (
    <Dialog open={open} fullWidth onTransitionExited={onClosed}>
      <form.Subscribe selector={(state) => state.values.vehicleCategory}>
        {(currentCategory) => {
          const categoryLabel = currentCategory === VehicleCategory.drone ? "Drone" : "Vehicle"
          return (
            <DialogTitle sx={{ padding: 1 }}>
              {vehicle ? `Edit ${categoryLabel}` : `Add ${categoryLabel}`}
            </DialogTitle>
          )
        }}
      </form.Subscribe>

      <DialogContent sx={{ padding: 1 }}>
        <Stack sx={{ gap: 1, padding: 1 }}>
          <VehicleFormFields form={form} fields={vehicleFieldMap} />
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
