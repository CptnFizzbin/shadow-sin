import type { FC } from "react"

import { EntityCard } from "#/components/entityCard/entityCard.tsx"
import { AttributeKey } from "#/system/attributeKey.ts"
import { AccessLevelLabels } from "#/system/matrix/accessLevel.ts"
import type { KnownNode } from "#/system/matrix/knownNode.ts"
import { NodeTypeLabels } from "#/system/matrix/nodeType.ts"

const MATRIX_STAT_LABELS: { key: AttributeKey, label: string }[] = [
  { key: AttributeKey.system, label: "Sys" },
  { key: AttributeKey.firewall, label: "FWL" },
  { key: AttributeKey.response, label: "Rsp" },
  { key: AttributeKey.signal, label: "Sig" },
]

interface MatrixNodeCardProps {
  node: KnownNode
  isActive: boolean
  onEdit: () => void
  onRemove: () => void
  onSetActive: () => void
  onDeactivate: () => void
}

export const MatrixNodeCard: FC<MatrixNodeCardProps> = ({
  node,
  isActive,
  onEdit,
  onRemove,
  onSetActive,
  onDeactivate,
}) => (
  <EntityCard entity={node} onEdit={onEdit} onRemove={onRemove}>
    <EntityCard.Layout.TitleRight>
      {isActive && <EntityCard.Stat value="Active" type="rating" />}
    </EntityCard.Layout.TitleRight>

    <EntityCard.Layout.HeaderRow>
      <EntityCard.Stat value={NodeTypeLabels[node.nodeType]} />
      <EntityCard.Stat value={AccessLevelLabels[node.accessLevel]} />
    </EntityCard.Layout.HeaderRow>

    <EntityCard.Layout.BodyRow sx={{ flexWrap: "wrap" }}>
      {MATRIX_STAT_LABELS.map(({ key, label }) => (
        <EntityCard.Stat key={key} label={label} value={node.matrix[key] ?? 0} />
      ))}
    </EntityCard.Layout.BodyRow>

    <EntityCard.Action
      label={isActive ? "Deactivate" : "Set Active"}
      onClick={isActive ? onDeactivate : onSetActive}
    />
  </EntityCard>
)
