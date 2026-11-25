import type { FC } from "react"

import { ItemCardGrid } from "#/app/components/entities/items/card/itemCardGrid.tsx"
import { useVehicleFormDialog } from "#/app/components/entities/items/types/vehicles/dialogs/vehicleFormDialog.tsx"
import { VehicleDataCard } from "#/app/components/entities/items/types/vehicles/vehicleDataCard.tsx"
import { useOpenItemDetails } from "#/app/hooks/items/useOpenItemDetails.ts"
import type { ItemData } from "#/data/items/itemData.ts"
import type { VehicleData } from "#/data/items/vehicleData.ts"
import { isVehicleData } from "#/data/items/vehicleData.ts"
import { isNewItem } from "#/state/runner/items/items.actions.ts"
import { ItemSelectors } from "#/state/runner/items/items.selector.ts"
import { Actions } from "#/state/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/state/runner/runnerStore.dispatch.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"

import { useGearListView } from "./gearListFilter.ts"

export const VehiclesSectionContent: FC = () => {
  const dispatch = useRunnerStoreDispatch()
  const openItemDetails = useOpenItemDetails()
  const allGear = useRunnerSelector(ItemSelectors.selectAll)
  const vehicleFormDialog = useVehicleFormDialog()
  const gearListView = useGearListView()

  const saveItem = (item: ItemData) =>
    dispatch(isNewItem(item) ? Actions.item.addItem(item) : Actions.item.setItem(item))

  const vehicles = Object.values(allGear).filter(isVehicleData)

  const handleEditVehicle = async (vehicle?: VehicleData) => {
    const saved = await vehicleFormDialog.open({ vehicle })
    if (saved) saveItem(saved)
  }

  return (
    <ItemCardGrid>
      {gearListView(vehicles).map((vehicle) => (
        <VehicleDataCard
          key={vehicle.id}
          vehicle={vehicle}
          onOpen={openItemDetails ? () => openItemDetails(vehicle.id) : () => handleEditVehicle(vehicle)}
          onEdit={openItemDetails ? () => handleEditVehicle(vehicle) : undefined}
        />
      ))}

      {vehicleFormDialog.outlet}
    </ItemCardGrid>
  )
}
