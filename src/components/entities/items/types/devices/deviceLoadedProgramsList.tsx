import Button from "@mui/material/Button"
import ButtonGroup from "@mui/material/ButtonGroup"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { useRunProgramDialog } from "#/components/system/matrix/dialogs/runProgramDialog.tsx"
import { isNewItem } from "#/state/runner/items/items.actions.ts"
import { Actions } from "#/state/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/state/runner/runnerStore.dispatch.ts"
import type { DeviceData } from "#/system/model/items/deviceData.ts"
import type { ItemData } from "#/system/model/items/itemData.ts"
import type { ProgramData } from "#/system/model/items/programData.ts"
import { Icons } from "#/utils/icons.ts"

import { useAgentFormDialog } from "./dialogs/agentFormDialog.tsx"
import { useProgramFormDialog } from "./dialogs/programFormDialog.tsx"
import { LoadedProgramCard } from "./loadedProgramCard.tsx"

export interface DeviceLoadedProgramsListProps {
  device: DeviceData
  /** The Programs and Agents loaded on `device`. */
  programs: ProgramData[]
  onOpenProgram?: (item: ItemData) => void
}

/** The Programs and Agents **Loaded** on a device, each with a Run action, plus buttons to load new ones. */
export const DeviceLoadedProgramsList: FC<DeviceLoadedProgramsListProps> = ({ device, programs, onOpenProgram }) => {
  const dispatch = useRunnerStoreDispatch()
  const programFormDialog = useProgramFormDialog()
  const agentFormDialog = useAgentFormDialog()
  const runProgramDialog = useRunProgramDialog()

  const saveItem = (saved: ProgramData | undefined) => {
    if (saved) dispatch(isNewItem(saved) ? Actions.item.addItem(saved) : Actions.item.setItem(saved))
  }

  const handleAddProgram = async () => saveItem(await programFormDialog.open({ parentId: device.id }))
  const handleAddAgent = async () => saveItem(await agentFormDialog.open({ parentId: device.id }))

  return (
    <Stack>
      {programs.length === 0 && (
        <Typography sx={{ color: "text.secondary", textAlign: "center" }}>No Programs loaded</Typography>
      )}

      {programs.map((program) => (
        <LoadedProgramCard
          key={program.id}
          program={program}
          onOpen={onOpenProgram ? () => onOpenProgram(program) : undefined}
          leftAction={{
            label: "Run",
            icon: <Icons.item.run />,
            onClick: () => runProgramDialog.open({ program }),
          }}
        />
      ))}

      <ButtonGroup fullWidth>
        <Button variant="outlined" startIcon={<Icons.item.add />} onClick={handleAddProgram}>
          Add Program
        </Button>
        <Button variant="outlined" startIcon={<Icons.item.add />} onClick={handleAddAgent}>
          Add Agent
        </Button>
      </ButtonGroup>

      {programFormDialog.outlet}
      {agentFormDialog.outlet}
      {runProgramDialog.outlet}
    </Stack>
  )
}
