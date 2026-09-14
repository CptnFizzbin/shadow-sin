import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { useVehicleFormDialog } from "#/components/items/types/vehicles/dialogs/vehicleFormDialog.tsx"
import { VehicleDataCard } from "#/components/items/types/vehicles/vehicleDataCard.tsx"
import { useOpenItemDetails } from "#/hooks/items/useOpenItemDetails.ts"
import { isNewItem } from "#/state/runner/items/items.actions.ts"
import { ItemSelectors } from "#/state/runner/items/items.selector.ts"
import { Actions } from "#/state/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/state/runner/runnerStore.dispatch.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"
import type { ItemData } from "#/system/model/items/itemData.ts"
import type { VehicleData } from "#/system/model/items/vehicleData.ts"
import { isVehicleData } from "#/system/model/items/vehicleData.ts"

export const VehiclesSectionContent: FC = () => {
  const dispatch = useRunnerStoreDispatch()
  const openItemDetails = useOpenItemDetails()
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
          onOpen={openItemDetails ? () => openItemDetails(vehicle.id) : () => handleEditVehicle(vehicle)}
          onEdit={openItemDetails ? () => handleEditVehicle(vehicle) : undefined}
        />
      ))}

      {vehicleFormDialog.outlet}
    </Stack>
  )
}
