import Button from "@mui/material/Button"
import Chip from "@mui/material/Chip"
import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiDeleteBin6Line } from "@remixicon/react"
import type { FC } from "react"

import { AttributeKey } from "#/system/attributeKey.ts"
import { AccessLevelLabels } from "#/system/matrix/accessLevel.ts"
import type { KnownNode } from "#/system/matrix/knownNode.ts"
import { NodeTypeLabels } from "#/system/matrix/nodeType.ts"

const MATRIX_STAT_CHIPS: { key: AttributeKey, label: string }[] = [
  { key: AttributeKey.system, label: "Sys" },
  { key: AttributeKey.firewall, label: "FWL" },
  { key: AttributeKey.response, label: "Rsp" },
  { key: AttributeKey.signal, label: "Sig" },
]

interface KnownNodeCardProps {
  node: KnownNode
  isActive: boolean
  onEdit: () => void
  onRemove: () => void
  onSetActive: () => void
  onDeactivate: () => void
}

export const KnownNodeCard: FC<KnownNodeCardProps> = ({
  node,
  isActive,
  onEdit,
  onRemove,
  onSetActive,
  onDeactivate,
}) => {
  return (
    <Stack
      direction="row"
      onClick={onEdit}
      sx={{
        "alignItems": "center", "gap": 1, "padding": 1,
        "borderRadius": 1,
        "border": "1px solid",
        "borderColor": isActive ? "secondary.main" : "divider",
        "cursor": "pointer",
        "&:hover": { bgcolor: "action.hover" },
      }}
    >
      <Stack sx={{ gap: 0.5, flexGrow: 1 }}>
        <Stack direction="row" sx={{ alignItems: "center" }}>
          <Typography sx={{ flexGrow: 1 }}>{node.name}</Typography>

          {isActive && <Chip label="Active" size="small" color="secondary" />}

          <IconButton
            size="small"
            color="error"
            aria-label="Remove"
            onClick={(e) => {
              e.stopPropagation()
              onRemove()
            }}
          >
            <RiDeleteBin6Line size={16} />
          </IconButton>
        </Stack>

        <Stack direction="row" sx={{ flexWrap: "wrap", gap: 0.5 }}>
          <Chip label={NodeTypeLabels[node.nodeType]} size="small" variant="outlined" />
          <Chip label={AccessLevelLabels[node.accessLevel]} size="small" variant="outlined" />
          {MATRIX_STAT_CHIPS.map(({ key, label }) => (
            <Chip
              key={key}
              label={`${label}: ${node.matrix[key] ?? 0}`}
              size="small"
              variant="outlined"
              sx={{ height: 20, fontSize: "0.7rem" }}
            />
          ))}
        </Stack>

        <Button
          size="small"
          variant="outlined"
          color="secondary"
          sx={{ alignSelf: "flex-start" }}
          onClick={(e) => {
            e.stopPropagation()
            if (isActive) onDeactivate()
            else onSetActive()
          }}
        >
          {isActive ? "Deactivate" : "Set Active"}
        </Button>
      </Stack>
    </Stack>
  )
}
