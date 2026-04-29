import ToggleButton from "@mui/material/ToggleButton"
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup"
import type { FC } from "react"

import { useDialogApi } from "#/components/dialogs/api/dialogApiProvider.tsx"
import { ItemDialog } from "#/components/items/dialogs/itemDialog.tsx"
import { useVehicleForm, vehicleFieldMap } from "#/components/items/types/vehicles/forms/useVehicleForm.tsx"
import { VehicleFormFields } from "#/components/items/types/vehicles/forms/vehicleFormFields.tsx"
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

export type UseVehicleFormDialogProps = Omit<VehicleFormDialogProps, "open" | "onClose" | "onClosed" | "onSave">

export const useVehicleFormDialog = () => {
  const dialogApi = useDialogApi()

  return {
    open: (props?: UseVehicleFormDialogProps) => dialogApi.open<VehicleData>(
      (dialogProps) => (
        <VehicleFormDialog
          {...dialogProps}
          {...props}
          onSave={(vehicle) => dialogProps.onClose(vehicle)}
        />
      ),
    ),
  }
}
