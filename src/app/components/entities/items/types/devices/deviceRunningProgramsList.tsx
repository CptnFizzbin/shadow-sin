import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { MatrixSelectors } from "#/state/runner/gameState/matrix/matrix.selector.ts"
import { Actions } from "#/state/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/state/runner/runnerStore.dispatch.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"
import type { ItemData } from "#/system/model/items/itemData.ts"
import type { ProgramData } from "#/system/model/items/programData.ts"

import { RunningProgramCard } from "./runningProgramCard.tsx"

export interface DeviceRunningProgramsListProps {
  /** The Programs and Agents loaded on the device; only their running copies are listed. */
  programs: ProgramData[]
  onOpenProgram?: (item: ItemData) => void
}

/** Every Known Node a device's loaded Programs and Agents are **Running** on, each with a Terminate action. */
export const DeviceRunningProgramsList: FC<DeviceRunningProgramsListProps> = ({ programs, onOpenProgram }) => {
  const dispatch = useRunnerStoreDispatch()
  const activePrograms = useRunnerSelector(MatrixSelectors.selectActivePrograms)
  const knownNodes = useRunnerSelector(MatrixSelectors.selectKnownNodes)

  const runningPrograms = activePrograms.flatMap((activeProgram) => {
    const program = programs.find(({ id }) => id === activeProgram.sourceId)
    const node = knownNodes.find(({ id }) => id === activeProgram.nodeId)
    return program && node ? [{ activeProgram, program, node }] : []
  })

  return (
    <Stack>
      {runningPrograms.length === 0 && (
        <Typography sx={{ color: "text.secondary", textAlign: "center" }}>Nothing running</Typography>
      )}

      {runningPrograms.map(({ activeProgram, program, node }) => (
        <RunningProgramCard
          key={`${activeProgram.sourceId}-${activeProgram.nodeId}`}
          program={program}
          node={node}
          onOpen={onOpenProgram ? () => onOpenProgram(program) : undefined}
          onTerminate={() => dispatch(Actions.gameState.matrix.stopActiveProgram(activeProgram))}
        />
      ))}
    </Stack>
  )
}
