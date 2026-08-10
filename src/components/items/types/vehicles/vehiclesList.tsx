import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import { RiAddLine } from "@remixicon/react"
import type { FC } from "react"

import { useGearFilter } from "#/lib/hooks/items/gearHooks.ts"
import { useOpenItemDetails } from "#/lib/hooks/items/useOpenItemDetails.ts"
import { isNewItem } from "#/lib/stores/runner/gear/gearSlice.actions.ts"
import { Actions } from "#/lib/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/lib/stores/runner/runnerStore.dispatch.ts"
import type { VehicleData } from "#/system/gear/vehicleData.ts"
import { isVehicleData, VehicleCategory } from "#/system/gear/vehicleData.ts"
import type { ItemData } from "#/system/itemData.ts"

import { useVehicleFormDialog } from "./dialogs/vehicleFormDialog.tsx"
import { VehicleDataCard } from "./vehicleDataCard.tsx"

interface VehiclesListProps {
  vehicleCategory: VehicleCategory
}

export const VehiclesList: FC<VehiclesListProps> = ({ vehicleCategory }) => {
  const dispatch = useRunnerStoreDispatch()
  const openItemDetails = useOpenItemDetails()
  const vehicleFormDialog = useVehicleFormDialog()

  const saveItem = (item: ItemData) =>
    dispatch(isNewItem(item) ? Actions.item.addItem(item) : Actions.item.setItem(item))

  const vehicles = useGearFilter(
    (item): item is VehicleData =>
      isVehicleData(item) && item.vehicleCategory === vehicleCategory,
  )

  const categoryLabel = vehicleCategory === VehicleCategory.drone ? "Drone" : "Vehicle"

  const handleEditVehicle = async (vehicle?: VehicleData) => {
    const saved = await vehicleFormDialog.open({ vehicle, vehicleCategory })
    if (saved) saveItem(saved)
  }

  return (
    <Stack>
      {vehicles.map((vehicle) => (
        <VehicleDataCard
          key={vehicle.id}
          vehicle={vehicle}
          onOpen={openItemDetails
            ? () => openItemDetails(vehicle.id)
            : () => handleEditVehicle(vehicle)}
          onEdit={openItemDetails ? () => handleEditVehicle(vehicle) : undefined}
        />
      ))}

      <Button
        variant="outlined"
        size="small"
        startIcon={<RiAddLine size={14} />}
        onClick={() => handleEditVehicle()}
        color="secondary"
        fullWidth
      >
        Add {categoryLabel}
      </Button>

      {vehicleFormDialog.dialog}
    </Stack>
  )
}
