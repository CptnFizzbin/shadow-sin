import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import { RiAddLine } from "@remixicon/react"
import type { FC } from "react"
import { useState } from "react"

import { GearItemCard } from "#/components/characterBuilder/sections/gear/generic/gearItemCard.tsx"
import { useGearFilter, useGearStore } from "#/components/gear/useGearApi.ts"
import { VehicleFormDialog } from "#/components/vehicles/dialogs/vehicleFormDialog.tsx"
import type { VehicleData } from "#/lib/system/gear/vehicleData.ts"
import { VehicleCategory, isVehicleData } from "#/lib/system/gear/vehicleData.ts"

type VehicleDialogState =
  | null
  | { mode: "create", open: boolean }
  | { mode: "edit", vehicle: VehicleData, open: boolean }

interface VehiclesListProps {
  vehicleCategory: VehicleCategory
}

export const VehiclesList: FC<VehiclesListProps> = ({ vehicleCategory }) => {
  const gearApi = useGearStore()
  const [dialogState, setDialogState] = useState<VehicleDialogState>(null)

  const vehicles = useGearFilter(
    (item): item is VehicleData =>
      isVehicleData(item) && item.vehicleCategory === vehicleCategory,
  )

  const categoryLabel = vehicleCategory === VehicleCategory.drone ? "Drone" : "Vehicle"

  const closeDialog = () =>
    setDialogState((prev) => prev && { ...prev, open: false })

  const handleSave = (vehicle: VehicleData) => {
    gearApi.save(vehicle)
    closeDialog()
  }

  return (
    <Stack gap={1}>
      {vehicles.map((vehicle) => (
        <GearItemCard
          key={vehicle.id}
          item={vehicle}
          onEdit={() => setDialogState({ mode: "edit", vehicle, open: true })}
          onRemove={() => gearApi.remove(vehicle)}
        />
      ))}

      <Button
        variant="outlined"
        size="small"
        startIcon={<RiAddLine size={14} />}
        onClick={() => setDialogState({ mode: "create", open: true })}
        color="secondary"
        fullWidth
      >
        Add {categoryLabel}
      </Button>

      {dialogState?.mode === "create" && (
        <VehicleFormDialog
          open={dialogState.open}
          vehicleCategory={vehicleCategory}
          onSave={handleSave}
          onClose={closeDialog}
          onClosed={() => setDialogState(null)}
        />
      )}

      {dialogState?.mode === "edit" && (
        <VehicleFormDialog
          open={dialogState.open}
          vehicle={dialogState.vehicle}
          onSave={handleSave}
          onClose={closeDialog}
          onClosed={() => setDialogState(null)}
        />
      )}
    </Stack>
  )
}
