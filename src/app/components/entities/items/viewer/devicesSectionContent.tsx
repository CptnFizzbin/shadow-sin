import type { FC } from "react"

import { ItemCardGrid } from "#/app/components/entities/items/card/itemCardGrid.tsx"
import { DeviceDataCard } from "#/app/components/entities/items/types/devices/deviceDataCard.tsx"
import { useDeviceFormDialog } from "#/app/components/entities/items/types/devices/dialogs/deviceFormDialog.tsx"
import { useOpenItemDetails } from "#/app/hooks/items/useOpenItemDetails.ts"
import type { DeviceData } from "#/data/items/deviceData.ts"
import { ItemType } from "#/data/items/itemType.ts"
import type { ItemCatalog } from "#/data/items/itemUtils.ts"
import { isNewItem } from "#/state/runner/items/items.actions.ts"
import { ItemSelectors } from "#/state/runner/items/items.selector.ts"
import { Actions } from "#/state/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/state/runner/runnerStore.dispatch.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"

import { useGearListView } from "./gearListFilter.ts"

export const DevicesSectionContent: FC = () => {
  const dispatch = useRunnerStoreDispatch()
  const openItemDetails = useOpenItemDetails()
  const devices = useRunnerSelector(ItemSelectors.selectByType, { itemType: ItemType.device }) as ItemCatalog<DeviceData>
  const deviceFormDialog = useDeviceFormDialog()
  const gearListView = useGearListView()

  const saveItem = (item: DeviceData) =>
    dispatch(isNewItem(item) ? Actions.item.addItem(item) : Actions.item.setItem(item))

  const handleEditDevice = async (device?: DeviceData) => {
    const saved = await deviceFormDialog.open({ device })
    if (saved) saveItem(saved)
  }

  return (
    <ItemCardGrid>
      {gearListView(Object.values(devices)).map((device) => (
        <DeviceDataCard
          key={device.id}
          device={device}
          onOpen={openItemDetails ? () => openItemDetails(device.id) : () => handleEditDevice(device)}
          onEdit={openItemDetails ? () => handleEditDevice(device) : undefined}
        />
      ))}

      {deviceFormDialog.outlet}
    </ItemCardGrid>
  )
}
