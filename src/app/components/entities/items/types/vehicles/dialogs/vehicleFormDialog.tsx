import ToggleButton from "@mui/material/ToggleButton"
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup"
import type { FC } from "react"

import { ItemDialog } from "#/app/components/entities/items/dialogs/itemDialog.tsx"
import { GearFormLicenseSection } from "#/app/components/entities/items/types/licenses/gearFormLicenseSection.tsx"
import { VehicleFormFields } from "#/app/components/entities/items/types/vehicles/forms/vehicleFormFields.tsx"
import type { UUID } from "#/common/uuid/uuidUtils.ts"
import type { VehicleData } from "#/data/items/vehicleData.ts"
import { VehicleCategory } from "#/data/items/vehicleData.ts"
import type { AnyDialogCtrl } from "#/forms/dialog/dialogCtrl.ts"
import { useDialog } from "#/forms/dialog/useDialog.tsx"
import { useVehicleForm, vehicleFieldMap } from "#/forms/items/types/vehicles/useVehicleForm.tsx"

interface VehicleFormDialogProps {
  ctrl: AnyDialogCtrl
  vehicle?: VehicleData
  vehicleCategory?: VehicleCategory
  wizard?: boolean
  parentId?: UUID
}

export const VehicleFormDialog: FC<VehicleFormDialogProps> = ({ ctrl, vehicle, vehicleCategory, wizard, parentId }) => {
  const form = useVehicleForm({
    vehicle,
    vehicleCategory,
    parentId,
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
      wizard={wizard}
      options={{
        hasRating: { enabled: true },
        isSubItem: parentId ? { forced: true } : undefined,
      }}
      slots={{
        // Suppressed in wizard mode — the workflow's own "Select Subtype" step
        // already resolves Vehicle vs. Drone before this dialog opens.
        preForm: wizard
          ? undefined
          : () => (
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
