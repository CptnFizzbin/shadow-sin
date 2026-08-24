import ToggleButton from "@mui/material/ToggleButton"
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup"
import type { FC } from "react"

import { ItemDialog } from "#/components/items/dialogs/itemDialog.tsx"
import { GearFormLicenseSection } from "#/components/items/types/licenses/gearFormLicenseSection.tsx"
import { VehicleFormFields } from "#/components/items/types/vehicles/forms/vehicleFormFields.tsx"
import type { AnyDialogCtrl } from "#/components/ui/dialog/dialogCtrl.ts"
import { useVehicleForm, vehicleFieldMap } from "#/hooks/items/types/vehicles/forms/useVehicleForm.tsx"
import { useDialog } from "#/hooks/ui/dialog/useDialog.tsx"
import type { VehicleData } from "#/system/gear/vehicleData.ts"
import { VehicleCategory } from "#/system/gear/vehicleData.ts"

interface VehicleFormDialogProps {
  ctrl: AnyDialogCtrl
  vehicle?: VehicleData
  vehicleCategory?: VehicleCategory
}

const VehicleFormDialog: FC<VehicleFormDialogProps> = ({ ctrl, vehicle, vehicleCategory }) => {
  const form = useVehicleForm({
    vehicle,
    vehicleCategory,
    onSubmit: (vehicleData) => ctrl.close(vehicleData),
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
      ctrl={ctrl}
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
        itemFields: () => (
          <>
            <VehicleFormFields form={form} fields={vehicleFieldMap} />
            <GearFormLicenseSection form={form} />
          </>
        ),
      }}
    />
  )
}

type UseVehicleFormDialogProps = Omit<VehicleFormDialogProps, "ctrl">

export const useVehicleFormDialog = () => useDialog<VehicleData, UseVehicleFormDialogProps | undefined>(
  (ctrl, props) => <VehicleFormDialog ctrl={ctrl} {...props} />,
)
