import type { FC } from "react"

import { EntityProvider } from "#/contexts/entity/entity.provider.tsx"
import type { AgentData } from "#/system/model/items/agentData.ts"
import type { ItemData } from "#/system/model/items/itemData.ts"

import { AgentItemDetailsBody } from "./agentItemDetailsBody.tsx"

export interface AgentItemDetailsProps {
  agent: AgentData
  onRemoved?: () => void
  /** Called with an attached, currently-running Program when its subitem card is tapped. */
  onOpenAttachment?: (item: ItemData) => void
}

export const AgentItemDetails: FC<AgentItemDetailsProps> = ({ agent, onRemoved, onOpenAttachment }) => (
  <EntityProvider entity={agent}>
    <AgentItemDetailsBody agent={agent} onRemoved={onRemoved} onOpenAttachment={onOpenAttachment} />
  </EntityProvider>
)
