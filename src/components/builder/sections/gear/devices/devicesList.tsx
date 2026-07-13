import type { UUID } from "node:crypto"

import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import { RiAddLine } from "@remixicon/react"
import type { FC } from "react"

import { useGearByType } from "#/components/items/gearHooks.ts"
import { DeviceItemCard } from "#/components/items/types/devices/deviceItemCard.tsx"
import { useDeviceFormDialog } from "#/components/items/types/devices/dialogs/deviceFormDialog.tsx"
import { useProgramFormDialog } from "#/components/items/types/devices/dialogs/programFormDialog.tsx"
import { isNewItem } from "#/stores/runner/gear/gearSlice.actions.ts"
import { Actions } from "#/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/stores/runner/runnerStore.dispatch.ts"
import type { DeviceData } from "#/system/gear/deviceData.ts"
import type { ProgramData } from "#/system/gear/programData.ts"
import { ItemType } from "#/system/itemType.ts"

export const DevicesList: FC = () => {
  const dispatch = useRunnerStoreDispatch()
  const devices = useGearByType<DeviceData>(ItemType.device)
  const programs = useGearByType<ProgramData>(ItemType.program)
  const deviceFormDialog = useDeviceFormDialog()
  const programFormDialog = useProgramFormDialog()

  const saveItem = (item: DeviceData | ProgramData) =>
    dispatch(isNewItem(item) ? Actions.gear.addItem(item) : Actions.gear.setItem(item))

  const rootDevices = devices.filter((device) => !device.parentId)
  const getProgramsForDevice = (deviceId: string) =>
    programs.filter((program) => program.parentId === deviceId)

  const handleEditDevice = async (device?: DeviceData) => {
    const saved = await deviceFormDialog.open({ device })
    if (saved) saveItem(saved)
  }

  const handleEditProgram = async (program?: ProgramData, parentId?: UUID) => {
    const saved = await programFormDialog.open({ program, parentId })
    if (saved) saveItem(saved)
  }

  return (
    <Stack sx={{ gap: 1 }}>
      {rootDevices.map((device) => {
        const devicePrograms = getProgramsForDevice(device.id)

        return (
          <DeviceItemCard
            key={device.id}
            device={device}
            programs={devicePrograms}
            onEdit={() => handleEditDevice(device)}
            onRemove={() => dispatch(Actions.gear.removeItem({ id: device.id, removeChildren: true }))}
            onAddProgram={() => handleEditProgram(undefined, device.id as UUID)}
            onEditProgram={(program) => handleEditProgram(program)}
            onRemoveProgram={(program) => dispatch(Actions.gear.removeItem({ id: program.id }))}
          />
        )
      })}

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
      {programFormDialog.dialog}
    </Stack>
  )
}
