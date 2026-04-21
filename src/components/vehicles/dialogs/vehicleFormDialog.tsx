import ToggleButton from "@mui/material/ToggleButton"
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup"
import type { FC } from "react"

import { ItemDialog } from "#/components/gear/dialogs/itemDialog.tsx"
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
  const form = useVehicleForm({
    vehicle,
    vehicleCategory,
    onSubmit: onSave,
  })

  const title = (
    <form.Subscribe selector={({ values }) => values.vehicleCategory}>
      {(currentCategory) => {
        const categoryLabel = currentCategory === VehicleCategory.drone ? "Drone" : "Vehicle"
        return vehicle ? `Edit ${categoryLabel}` : `Add ${categoryLabel}`
      }}
    </form.Subscribe>
  )

  return (
    <ItemDialog
      form={form}
      title={title}
      open={open}
      onClose={onClose}
      onClosed={onClosed}
      options={{
        hasRating: { enabled: true },
      }}
      slots={{
        preForm: () => (
          <form.Subscribe selector={({ values }) => values.vehicleCategory}>
            {(currentCategory) => (
              <ToggleButtonGroup
                exclusive
                size="small"
                value={currentCategory}
                onChange={(_, value: VehicleCategory | null) => {
                  if (value !== null) {
                    form.setFieldValue("vehicleCategory", value)
                  }
                }}
                fullWidth
              >
                <ToggleButton value={VehicleCategory.vehicle}>Vehicle</ToggleButton>
                <ToggleButton value={VehicleCategory.drone}>Drone</ToggleButton>
              </ToggleButtonGroup>
            )}
          </form.Subscribe>
        ),
        itemFields: () => <VehicleFormFields form={form} fields={vehicleFieldMap} />,
      }}
    />
  )
}
