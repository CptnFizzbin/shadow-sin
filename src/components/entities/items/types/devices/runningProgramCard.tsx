import type { FC } from "react"

import { EntityCard } from "#/components/ui/cards/entityCard/entityCard.tsx"
import type { ProgramData } from "#/system/model/items/programData.ts"
import type { KnownNode } from "#/system/model/matrix/knownNode.ts"
import { Icons } from "#/utils/icons.ts"

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
