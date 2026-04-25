import type { UUID } from "node:crypto"

import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import { RiAddLine } from "@remixicon/react"
import type { FC } from "react"

import { DeviceItemCard } from "#/components/items/types/devices/deviceItemCard.tsx"
import { useDeviceFormDialog } from "#/components/items/types/devices/dialogs/deviceFormDialog.tsx"
import { useProgramFormDialog } from "#/components/items/types/devices/dialogs/programFormDialog.tsx"
import { useGearByType, useGearStore } from "#/components/items/useGearStore.ts"
import type { DeviceData } from "#/system/gear/deviceData.ts"
import type { ProgramData } from "#/system/gear/programData.ts"
import { ItemType } from "#/system/itemType.ts"

export const DevicesList: FC = () => {
  const gearStore = useGearStore()
  const devices = useGearByType<DeviceData>(ItemType.device)
  const programs = useGearByType<ProgramData>(ItemType.program)
  const deviceFormDialog = useDeviceFormDialog()
  const programFormDialog = useProgramFormDialog()

  const rootDevices = devices.filter((device) => !device.parentId)
  const getProgramsForDevice = (deviceId: string) =>
    programs.filter((program) => program.parentId === deviceId)

  const handleEditDevice = async (device?: DeviceData) => {
    const saved = await deviceFormDialog.open({ device }).result()
    if (saved) gearStore.save(saved)
  }

  const handleEditProgram = async (program?: ProgramData, parentId?: UUID) => {
    const saved = await programFormDialog.open({ program, parentId }).result()
    if (saved) gearStore.save(saved)
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
            onRemove={() => gearStore.remove(device, { removeChildren: true })}
            onAddProgram={() => handleEditProgram(undefined, device.id as UUID)}
            onEditProgram={(program) => handleEditProgram(program)}
            onRemoveProgram={(program) => gearStore.remove(program)}
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
    </Stack>
  )
}
