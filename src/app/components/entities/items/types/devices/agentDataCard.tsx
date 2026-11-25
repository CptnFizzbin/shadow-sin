import type { FC } from "react"

import type { EntityCardLeftAction } from "#app/components/ui/cards/entityCard/entityCard.tsx"
import type { AgentData } from "#data/items/agentData.ts"
import { EntityProvider } from "#state/entity/entity.provider.tsx"

import { AgentDataCardBody } from "./agentDataCardBody.tsx"

interface AgentDataCardProps {
  agent: AgentData
  onOpen?: () => void
  onEdit?: () => void
  leftAction?: EntityCardLeftAction
}

export const AgentDataCard: FC<AgentDataCardProps> = ({ agent, onOpen, onEdit, leftAction }) => (
  <EntityProvider entity={agent}>
    <AgentDataCardBody agent={agent} onOpen={onOpen} onEdit={onEdit} leftAction={leftAction} />
  </EntityProvider>
)
