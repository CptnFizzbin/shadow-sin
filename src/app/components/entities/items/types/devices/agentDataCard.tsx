import type { FC } from "react"

import type { EntityCardLeftAction } from "#/components/ui/cards/entityCard/entityCard.tsx"
import { EntityProvider } from "#/contexts/entity/entity.provider.tsx"
import type { AgentData } from "#/system/model/items/agentData.ts"

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
