import type { FC } from "react"

import { EntityProvider } from "#/contexts/entity/entity.provider.tsx"
import type { AgentData } from "#/system/model/items/agentData.ts"

import { AgentDataCardBody } from "./agentDataCardBody.tsx"

interface AgentDataCardProps {
  agent: AgentData
  onOpen?: () => void
  onEdit?: () => void
}

export const AgentDataCard: FC<AgentDataCardProps> = ({ agent, onOpen, onEdit }) => (
  <EntityProvider entity={agent}>
    <AgentDataCardBody agent={agent} onOpen={onOpen} onEdit={onEdit} />
  </EntityProvider>
)
