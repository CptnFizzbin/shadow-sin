import type { FC } from "react"

import type { EntityCardLeftAction } from "#/components/ui/cards/entityCard/entityCard.tsx"
import { isAgentData } from "#/system/model/items/agentData.ts"
import type { ProgramData } from "#/system/model/items/programData.ts"

import { AgentDataCard } from "./agentDataCard.tsx"
import { ProgramDataCard } from "./programDataCard.tsx"

export interface LoadedProgramCardProps {
  program: ProgramData
  onOpen?: () => void
  leftAction?: EntityCardLeftAction
}

/** Card for a Program or Agent **Loaded** on a device, picking the Agent card when the Program is one. */
export const LoadedProgramCard: FC<LoadedProgramCardProps> = ({ program, onOpen, leftAction }) => (
  isAgentData(program)
    ? <AgentDataCard agent={program} onOpen={onOpen} leftAction={leftAction} />
    : <ProgramDataCard program={program} onOpen={onOpen} leftAction={leftAction} />
)
