import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { DeviceDataCard } from "#/components/entities/items/types/devices/deviceDataCard.tsx"
import { useDeviceFormDialog } from "#/components/entities/items/types/devices/dialogs/deviceFormDialog.tsx"
import { useOpenItemDetails } from "#/hooks/items/useOpenItemDetails.ts"
import { isNewItem } from "#/state/runner/items/items.actions.ts"
import { ItemSelectors } from "#/state/runner/items/items.selector.ts"
import { Actions } from "#/state/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/state/runner/runnerStore.dispatch.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"
import type { DeviceData } from "#/system/model/items/deviceData.ts"
import { ItemType } from "#/system/model/items/itemType.ts"
import type { ItemCatalog } from "#/system/model/items/itemUtils.ts"

export const DevicesSectionContent: FC = () => {
  const dispatch = useRunnerStoreDispatch()
  const openItemDetails = useOpenItemDetails()
  const devices = useRunnerSelector(ItemSelectors.selectByType, { itemType: ItemType.device }) as ItemCatalog<DeviceData>
  const deviceFormDialog = useDeviceFormDialog()

  const saveItem = (item: DeviceData) =>
    dispatch(isNewItem(item) ? Actions.item.addItem(item) : Actions.item.setItem(item))

  const handleEditDevice = async (device?: DeviceData) => {
    const saved = await deviceFormDialog.open({ device })
    if (saved) saveItem(saved)
  }

  return (
    <Stack>
      {Object.values(devices).map((device) => (
        <DeviceDataCard
          key={device.id}
          device={device}
          onOpen={openItemDetails ? () => openItemDetails(device.id) : () => handleEditDevice(device)}
          onEdit={openItemDetails ? () => handleEditDevice(device) : undefined}
        />
      ))}

      {deviceFormDialog.outlet}
    </Stack>
  )
}
