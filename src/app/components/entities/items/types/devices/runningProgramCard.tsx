import type { FC } from "react"

import { EntityCard } from "#app/components/ui/cards/entityCard/entityCard.tsx"
import type { ProgramData } from "#data/items/programData.ts"
import type { KnownNode } from "#data/matrix/knownNode.ts"
import { Icons } from "#ui/icons/icons.ts"

export interface RunningProgramCardProps {
  program: ProgramData
  node: KnownNode
  onOpen?: () => void
  onTerminate: () => void
}

/** One Program or Agent **Running** on a Known Node, with a Terminate action. */
export const RunningProgramCard: FC<RunningProgramCardProps> = ({ program, node, onOpen, onTerminate }) => (
  <EntityCard
    entity={program}
    onOpen={onOpen}
    leftAction={{ label: "Terminate", icon: <Icons.item.terminate />, onClick: onTerminate }}
  >
    <EntityCard.Layout.HeaderRow>
      <EntityCard.Stat label="On" value={node.name} />
    </EntityCard.Layout.HeaderRow>
  </EntityCard>
)
