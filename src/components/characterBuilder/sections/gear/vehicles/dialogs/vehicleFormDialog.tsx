import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { useIsBuilder } from "#/components/characterBuilder/hooks/useIsBuilder.ts"
import {
  vehicleFieldMap,
  useVehicleForm,
} from "#/components/characterBuilder/sections/gear/vehicles/forms/useVehicleForm.tsx"
import { VehicleFormFields } from "#/components/characterBuilder/sections/gear/vehicles/forms/vehicleFormFields.tsx"
import { GearAcquireActions } from "#/components/gear/gearAcquireActions.tsx"
import type { VehicleData } from "#/lib/system/gear/vehicleData.ts"
import { VehicleCategory } from "#/lib/system/gear/vehicleData.ts"

interface VehicleFormDialogProps {
  open: boolean
  vehicle?: VehicleData
  vehicleCategory?: VehicleCategory
  onClose: () => void
  onClosed?: () => void
  onSave?: (vehicle: VehicleData) => void
  onAcquire?: (vehicle: VehicleData) => void
  onPurchase?: (vehicle: VehicleData) => void
}

export const VehicleFormDialog: FC<VehicleFormDialogProps> = ({
  open,
  vehicle,
  vehicleCategory,
  onClose,
  onClosed,
  onSave,
  onAcquire,
  onPurchase,
}) => {
  const isBuilder = useIsBuilder()

  const categoryLabel =
    (vehicle?.vehicleCategory ?? vehicleCategory) === VehicleCategory.drone
      ? "Drone"
      : "Vehicle"
  const title = vehicle ? `Edit ${categoryLabel}` : `Add ${categoryLabel}`

  const form = useVehicleForm({
    vehicle,
    vehicleCategory,
    onSubmit: (submittedVehicle, meta) => {
      if (!isBuilder) {
        if (meta.submitAction === "purchase") {
          onPurchase?.(submittedVehicle)
        } else {
          onAcquire?.(submittedVehicle)
        }
      } else {
        onSave?.(submittedVehicle)
      }
    },
  })

  return (
    <Dialog open={open} fullWidth onTransitionExited={onClosed}>
      <DialogTitle sx={{ padding: 1 }}>{title}</DialogTitle>

      <DialogContent sx={{ padding: 1 }}>
        <Stack gap={1} sx={{ padding: 1 }}>
          <VehicleFormFields form={form} fields={vehicleFieldMap} />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ padding: 1 }}>
        {!isBuilder
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
