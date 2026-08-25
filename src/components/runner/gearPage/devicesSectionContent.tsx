import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import { RiAddLine } from "@remixicon/react"
import { useNavigate } from "@tanstack/react-router"
import type { FC } from "react"

import { DeviceDataCard } from "#/components/items/types/devices/deviceDataCard.tsx"
import { useDeviceFormDialog } from "#/components/items/types/devices/dialogs/deviceFormDialog.tsx"
import { isNewItem } from "#/stores/runner/gear/gearSlice.actions.ts"
import { Actions } from "#/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/stores/runner/runnerStore.dispatch.ts"
import { Selectors, useRunnerStoreSelector } from "#/stores/runner/runnerStore.selectors.ts"
import type { DeviceData } from "#/system/gear/deviceData.ts"
import { ItemType } from "#/system/itemType.ts"

export const DevicesSectionContent: FC = () => {
  const dispatch = useRunnerStoreDispatch()
  const navigate = useNavigate({ from: "/$runnerId" })
  const devices = useRunnerStoreSelector(Selectors.gear.selectGearOfType(ItemType.device))
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
          onOpen={() => navigate({ to: "/$runnerId/item/$itemId", params: { itemId: device.id } })}
          onEdit={() => handleEditDevice(device)}
        />
      ))}

      <Button
        variant="outlined"
        size="small"
        startIcon={<RiAddLine size={14} />}
        onClick={() => handleEditDevice()}
        color="secondary"
        fullWidth
      >
        Add Device
      </Button>

      {deviceFormDialog.outlet}
    </Stack>
  )
}
