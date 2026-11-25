import type { FC } from "react"

import type { AgentData } from "#data/items/agentData.ts"
import type { ItemData } from "#data/items/itemData.ts"
import { EntityProvider } from "#state/entity/entity.provider.tsx"

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
