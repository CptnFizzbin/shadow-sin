import Chip from "@mui/material/Chip"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemText from "@mui/material/ListItemText"
import Stack from "@mui/material/Stack"
import Tooltip from "@mui/material/Tooltip"
import { RiCheckLine } from "@remixicon/react"
import type { FC, ReactNode } from "react"

import { KarmaChip } from "#/components/runner/karma/karmaChip.tsx"

interface ImprovementSpecializationRowProps {
  primary: ReactNode
  fieldLabel: string
  isLastRow: boolean
  isQueued: boolean
  queuedName?: string
  canAfford: boolean
  cost: number
  onToggle: () => void
  onEdit: () => void
}

/**
 * Shared row for the Specialization section — one skill/knowledge/language
 * that can be specialized. Clicking the row toggles a queued specialization
 * on/off; clicking the queued-name chip reopens the picker to rename it.
 */
export const ImprovementSpecializationRow: FC<ImprovementSpecializationRowProps> = ({
  primary,
  fieldLabel,
  isLastRow,
  isQueued,
  queuedName,
  canAfford,
  cost,
  onToggle,
  onEdit,
}) => {
  const disabled = !canAfford && !isQueued

  return (
    <ListItem
      disablePadding
      divider={!isLastRow}
      secondaryAction={(
        <Stack direction="row" sx={{ alignItems: "center", gap: 0.5 }}>
          {isQueued && queuedName && (
            <Tooltip title={`Edit ${fieldLabel.toLowerCase()} name`}>
              <Chip
                label={queuedName}
                size="small"
                color="success"
                variant="outlined"
                onClick={onEdit}
                sx={{ cursor: "pointer", maxWidth: 160 }}
              />
            </Tooltip>
          )}
          <KarmaChip
            amount={cost}
            size="small"
            color={isQueued ? "success" : canAfford ? "default" : "warning"}
          />
          {isQueued && <RiCheckLine size={14} style={{ color: "var(--mui-palette-success-main)" }} />}
        </Stack>
      )}
    >
      <ListItemButton
        aria-label={isQueued ? `Remove ${fieldLabel.toLowerCase()}` : `Add ${fieldLabel.toLowerCase()}`}
        aria-pressed={isQueued}
        disabled={disabled}
        onClick={onToggle}
        sx={{ minHeight: 52, opacity: disabled ? 0.45 : 1 }}
      >
        <ListItemText primary={primary} secondary={queuedName ?? `Add ${fieldLabel.toLowerCase()}`} />
      </ListItemButton>
    </ListItem>
  )
}
