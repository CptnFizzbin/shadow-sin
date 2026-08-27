import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import { RiAddLine } from "@remixicon/react"
import { useNavigate } from "@tanstack/react-router"
import type { FC } from "react"

import { useVehicleFormDialog } from "#/components/items/types/vehicles/dialogs/vehicleFormDialog.tsx"
import { VehicleDataCard } from "#/components/items/types/vehicles/vehicleDataCard.tsx"
import { isNewItem } from "#/stores/runner/gear/gearSlice.actions.ts"
import { Actions } from "#/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/stores/runner/runnerStore.dispatch.ts"
import { useRunnerSelector } from "#/stores/runner/runnerStore.selectors.ts"
import { ItemSelectors } from "#/stores/runner/gear/gearSlice.selectors.ts"
import type { VehicleData } from "#/system/gear/vehicleData.ts"
import { isVehicleData } from "#/system/gear/vehicleData.ts"
import type { ItemData } from "#/system/itemData.ts"

export const VehiclesSectionContent: FC = () => {
  const dispatch = useRunnerStoreDispatch()
  const navigate = useNavigate({ from: "/$runnerId" })
  const allGear = useRunnerSelector(ItemSelectors.selectAll)
  const vehicleFormDialog = useVehicleFormDialog()

  const saveItem = (item: ItemData) =>
    dispatch(isNewItem(item) ? Actions.item.addItem(item) : Actions.item.setItem(item))

  const vehicles = Object.values(allGear).filter(isVehicleData)

  const handleEditVehicle = async (vehicle?: VehicleData) => {
    const saved = await vehicleFormDialog.open({ vehicle })
    if (saved) saveItem(saved)
  }

  return (
    <Stack>
      {vehicles.map((vehicle) => (
        <VehicleDataCard
          key={vehicle.id}
          vehicle={vehicle}
          onOpen={() => navigate({ to: "/$runnerId/item/$itemId", params: { itemId: vehicle.id } })}
          onEdit={() => handleEditVehicle(vehicle)}
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
        Add Vehicle
      </Button>

      {vehicleFormDialog.outlet}
    </Stack>
  )
}
