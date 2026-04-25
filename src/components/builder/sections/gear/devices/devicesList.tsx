import type { UUID } from "node:crypto"

import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import { RiAddLine } from "@remixicon/react"
import type { FC } from "react"
import { useState } from "react"

import { DeviceItemCard } from "#/components/items/types/devices/deviceItemCard.tsx"
import { DeviceFormDialog } from "#/components/items/types/devices/dialogs/deviceFormDialog.tsx"
import { ProgramFormDialog } from "#/components/items/types/devices/dialogs/programFormDialog.tsx"
import { useGearByType, useGearStore } from "#/components/items/useGearStore.ts"
import type { DeviceData } from "#/system/gear/deviceData.ts"
import type { ProgramData } from "#/system/gear/programData.ts"
import type { ItemData } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"

type DeviceDialogState = null | { device?: DeviceData, open: boolean }

type ProgramDialogState = null | { program?: ProgramData, parentId?: UUID, open: boolean }

export const DevicesList: FC = () => {
  const gearStore = useGearStore()
  const devices = useGearByType<DeviceData>(ItemType.device)
  const programs = useGearByType<ProgramData>(ItemType.program)

  const rootDevices = devices.filter((device) => !device.parentId)
  const getProgramsForDevice = (deviceId: string) =>
    programs.filter((program) => program.parentId === deviceId)

  const [deviceDialog, setDeviceDialog] = useState<DeviceDialogState>(null)
  const [programDialog, setProgramDialog] = useState<ProgramDialogState>(null)

  const closeDeviceDialog = () =>
    setDeviceDialog((prev) => prev && { ...prev, open: false })

  const closeProgramDialog = () =>
    setProgramDialog((prev) => prev && { ...prev, open: false })

  const handleSaveDevice = (device: ItemData) => {
    gearStore.save(device)
    closeDeviceDialog()
  }

  const handleSaveProgram = (program: ItemData) => {
    gearStore.save(program)
    closeProgramDialog()
  }

  const handleRemoveDevice = (device: ItemData) => {
    gearStore.remove(device, { removeChildren: true })
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
            onEdit={() => setDeviceDialog({ device, open: true })}
            onRemove={() => handleRemoveDevice(device)}
            onAddProgram={() => setProgramDialog({ parentId: device.id, open: true })}
            onEditProgram={(program) => setProgramDialog({ program, open: true })}
            onRemoveProgram={(program) => gearStore.remove(program)}
          />
        )
      })}

      <Button
        variant="outlined"
        size="small"
        startIcon={<RiAddLine size={14} />}
        onClick={() => setDeviceDialog({ open: true })}
        color="secondary"
        fullWidth
      >
        Add Device
      </Button>

      {deviceDialog !== null && (
        <DeviceFormDialog
          open={deviceDialog.open}
          device={deviceDialog.device}
          onSave={handleSaveDevice}
          onClose={closeDeviceDialog}
          onClosed={() => setDeviceDialog(null)}
        />
      )}

      {programDialog !== null && (
        <ProgramFormDialog
          open={programDialog.open}
          program={programDialog.program}
          parentId={programDialog.parentId}
          onSave={handleSaveProgram}
          onClose={closeProgramDialog}
          onClosed={() => setProgramDialog(null)}
        />
      )}
    </Stack>
  )
}
