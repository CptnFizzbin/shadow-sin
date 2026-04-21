import type { UUID } from "node:crypto"

import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import { RiAddLine } from "@remixicon/react"
import type { FC } from "react"
import { useState } from "react"

import { DeviceFormDialog } from "#/components/characterBuilder/sections/gear/devices/dialogs/deviceFormDialog.tsx"
import { ProgramFormDialog } from "#/components/characterBuilder/sections/gear/devices/dialogs/programFormDialog.tsx"
import { ItemCard } from "#/components/gear/itemCard.tsx"
import { useGearByType, useGearStore } from "#/components/gear/useGearApi.ts"
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
          <Box key={device.id}>
            <ItemCard
              item={device}
              onEdit={() => setDeviceDialog({ device, open: true })}
              onRemove={() => handleRemoveDevice(device)}
            />

            <Stack
              sx={{
                gap: 1, paddingTop: 1,
                paddingLeft: 1,
                paddingBottom: devicePrograms.length > 0 ? 1 : 0,
                borderLeft: "4px solid",
                borderBottom: devicePrograms.length > 0 ? "1px solid" : "none",
                borderColor: "divider",
              }}
            >
              {devicePrograms.map((program) => (
                <ItemCard
                  key={program.id}
                  item={program}
                  onEdit={() => setProgramDialog({ program, open: true })}
                  onRemove={() => gearStore.remove(program)}
                />
              ))}

              <Button
                variant="text"
                size="small"
                startIcon={<RiAddLine size={12} />}
                onClick={() => setProgramDialog({ parentId: device.id, open: true })}
                color="secondary"
                fullWidth
              >
                Add Program
              </Button>
            </Stack>
          </Box>
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
