import type { UUID } from "node:crypto"

import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import { RiAddLine } from "@remixicon/react"
import { useNavigate } from "@tanstack/react-router"
import type { FC } from "react"

import { DeviceItemCard } from "#/components/items/types/devices/deviceItemCard.tsx"
import { useDeviceFormDialog } from "#/components/items/types/devices/dialogs/deviceFormDialog.tsx"
import { useProgramFormDialog } from "#/components/items/types/devices/dialogs/programFormDialog.tsx"
import { ProgramItemCard } from "#/components/items/types/devices/programItemCard.tsx"
import { isNewItem } from "#/lib/stores/runner/gear/gearSlice.actions.ts"
import { Actions } from "#/lib/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/lib/stores/runner/runnerStore.dispatch.ts"
import { Selectors, useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import type { DeviceData } from "#/system/gear/deviceData.ts"
import type { ProgramData } from "#/system/gear/programData.ts"
import { ItemType } from "#/system/itemType.ts"

export const DevicesSectionContent: FC = () => {
  const dispatch = useRunnerStoreDispatch()
  const navigate = useNavigate({ from: "/$runnerId" })
  const devices = useRunnerStoreSelector(Selectors.gear.selectGearOfType(ItemType.device))
  const programs = useRunnerStoreSelector(Selectors.gear.selectGearOfType(ItemType.program))
  const deviceFormDialog = useDeviceFormDialog()
  const programFormDialog = useProgramFormDialog()

  const saveItem = (item: DeviceData | ProgramData) =>
    dispatch(isNewItem(item) ? Actions.gear.addItem(item) : Actions.gear.setItem(item))

  const getProgramsForDevice = (deviceId: string) =>
    Object.values(programs).filter((program) => program.parentId === deviceId)

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
      {Object.values(devices).map((device) => {
        const devicePrograms = getProgramsForDevice(device.id)

        return (
          <Stack key={device.id} sx={{ gap: 1 }}>
            <DeviceItemCard
              device={device}
              onOpen={() => navigate({ to: "/$runnerId/item/$itemId", params: { itemId: device.id } })}
              onEdit={() => handleEditDevice(device)}
            />

            {devicePrograms.length > 0 && (
              <Stack sx={{ gap: 1, pl: 2 }}>
                {devicePrograms.map((program) => (
                  <ProgramItemCard
                    key={program.id}
                    program={program}
                    onOpen={() => navigate({ to: "/$runnerId/item/$itemId", params: { itemId: program.id } })}
                    onEdit={() => handleEditProgram(program)}
                  />
                ))}
              </Stack>
            )}

            <Button
              variant="text"
              color="secondary"
              size="small"
              startIcon={<RiAddLine size={14} />}
              onClick={() => handleEditProgram(undefined, device.id as UUID)}
              fullWidth
            >
              Add Program
            </Button>
          </Stack>
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
