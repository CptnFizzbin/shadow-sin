import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import { RiAddLine } from "@remixicon/react"
import type { FC } from "react"

import { DeviceDataCard } from "#/components/items/types/devices/deviceDataCard.tsx"
import { useDeviceFormDialog } from "#/components/items/types/devices/dialogs/deviceFormDialog.tsx"
import { useGearByType } from "#/lib/hooks/items/gearHooks.ts"
import { isNewItem } from "#/lib/stores/runner/gear/gearSlice.actions.ts"
import { Actions } from "#/lib/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/lib/stores/runner/runnerStore.dispatch.ts"
import type { DeviceData } from "#/system/gear/deviceData.ts"
import { ItemType } from "#/system/itemType.ts"

export const DevicesList: FC = () => {
  const dispatch = useRunnerStoreDispatch()
  const devices = useGearByType<DeviceData>(ItemType.device)
  const deviceFormDialog = useDeviceFormDialog()

  const saveItem = (item: DeviceData) =>
    dispatch(isNewItem(item) ? Actions.item.addItem(item) : Actions.item.setItem(item))

  const rootDevices = devices.filter((device) => !device.items.parentId)

  const handleEditDevice = async (device?: DeviceData) => {
    const saved = await deviceFormDialog.open({ device })
    if (saved) saveItem(saved)
  }

  return (
    <Stack>
      {rootDevices.map((device) => (
        <DeviceDataCard key={device.id} device={device} onOpen={() => handleEditDevice(device)} />
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

      {deviceFormDialog.dialog}
    </Stack>
  )
}
