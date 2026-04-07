import type { UUID } from "node:crypto"

import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import { RiAddLine } from "@remixicon/react"
import type { FC } from "react"
import { useState } from "react"

import { DeviceFormDialog } from "#/components/characterBuilder/sections/gear/devices/dialogs/deviceFormDialog.tsx"
import { ProgramFormDialog } from "#/components/characterBuilder/sections/gear/devices/dialogs/programFormDialog.tsx"
import { GearItemCard } from "#/components/characterBuilder/sections/gear/generic/gearItemCard.tsx"
import { useGearByType, useGearStore } from "#/components/gear/useGearApi.ts"
import type { DeviceData } from "#/lib/system/gear/deviceData.ts"
import type { ProgramData } from "#/lib/system/gear/programData.ts"
import { GearType } from "#/lib/system/gearType.ts"
import type { ItemData } from "#/lib/system/itemData.ts"

type DeviceDialogState =
  | null
  | { mode: "create", open: boolean }
  | { mode: "edit", device: DeviceData, open: boolean }

type ProgramDialogState =
  | null
  | { mode: "create", parentId: UUID, open: boolean }
  | { mode: "edit", program: ProgramData, open: boolean }

export const DevicesList: FC = () => {
  const gearApi = useGearStore()
  const devices = useGearByType<DeviceData>(GearType.device)
  const programs = useGearByType<ProgramData>(GearType.program)

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
    gearApi.save(device)
    closeDeviceDialog()
  }

  const handleSaveProgram = (program: ItemData) => {
    gearApi.save(program)
    closeProgramDialog()
  }

  const handleRemoveDevice = (device: ItemData) => {
    gearApi.remove(device, { removeChildren: true })
  }

  return (
    <Stack gap={1}>
      {rootDevices.map((device) => {
        const devicePrograms = getProgramsForDevice(device.id)

        return (
          <Box key={device.id}>
            <GearItemCard
              item={device}
              onEdit={() => setDeviceDialog({ mode: "edit", device, open: true })}
              onRemove={() => handleRemoveDevice(device)}
            />

            <Stack
              gap={1}
              sx={{
                paddingTop: 1,
                paddingLeft: 1,
                paddingBottom: devicePrograms.length > 0 ? 1 : 0,
                borderLeft: "4px solid",
                borderBottom: devicePrograms.length > 0 ? "1px solid" : "none",
                borderColor: "divider",
              }}
            >
              {devicePrograms.map((program) => (
                <GearItemCard
                  key={program.id}
                  item={program}
                  onEdit={() =>
                    setProgramDialog({ mode: "edit", program, open: true })}
                  onRemove={() => gearApi.remove(program)}
                />
              ))}

              <Button
                variant="text"
                size="small"
                startIcon={<RiAddLine size={12} />}
                onClick={() =>
                  setProgramDialog({ mode: "create", parentId: device.id, open: true })}
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
        onClick={() => setDeviceDialog({ mode: "create", open: true })}
        color="secondary"
        fullWidth
      >
        Add Device
      </Button>

      {deviceDialog?.mode === "create" && (
        <DeviceFormDialog
          open={deviceDialog.open}
          onSave={handleSaveDevice}
          onClose={closeDeviceDialog}
          onClosed={() => setDeviceDialog(null)}
        />
      )}

      {deviceDialog?.mode === "edit" && (
        <DeviceFormDialog
          open={deviceDialog.open}
          device={deviceDialog.device}
          onSave={handleSaveDevice}
          onClose={closeDeviceDialog}
          onClosed={() => setDeviceDialog(null)}
        />
      )}

      {programDialog?.mode === "create" && (
        <ProgramFormDialog
          open={programDialog.open}
          parentId={programDialog.parentId}
          onSave={handleSaveProgram}
          onClose={closeProgramDialog}
          onClosed={() => setProgramDialog(null)}
        />
      )}

      {programDialog?.mode === "edit" && (
        <ProgramFormDialog
          open={programDialog.open}
          program={programDialog.program}
          onSave={handleSaveProgram}
          onClose={closeProgramDialog}
          onClosed={() => setProgramDialog(null)}
        />
      )}
    </Stack>
  )
}
