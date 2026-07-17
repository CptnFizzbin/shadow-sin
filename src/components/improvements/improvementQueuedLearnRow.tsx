import IconButton from "@mui/material/IconButton"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import Stack from "@mui/material/Stack"
import Tooltip from "@mui/material/Tooltip"
import { RiCheckLine, RiDeleteBin6Line } from "@remixicon/react"
import type { FC, ReactNode } from "react"

import { KarmaChip } from "#/components/runner/karma/karmaChip.tsx"

interface ImprovementQueuedLearnRowProps {
  primary: ReactNode
  secondary: ReactNode
  cost: number
  isLastRow: boolean
  onRemove: () => void
}

/**
 * Shared row for a queued "learn new X" improvement entry — shown beneath the
 * existing-skill rows in each improvement list. Highlights the cost and lets
 * the user remove the queued entry.
 */
export const ImprovementQueuedLearnRow: FC<ImprovementQueuedLearnRowProps> = ({
  primary,
  secondary,
  cost,
  isLastRow,
  onRemove,
}) => {
  return (
    <ListItem
      disablePadding
      divider={!isLastRow}
      secondaryAction={(
        <Stack direction="row" sx={{ alignItems: "center", gap: 0.5 }}>
          <KarmaChip amount={cost} size="small" color="success" />
          <RiCheckLine size={14} style={{ color: "var(--mui-palette-success-main)" }} />
          <Tooltip title="Remove">
            <IconButton size="small" aria-label="Remove queued" onClick={onRemove}>
              <RiDeleteBin6Line size={16} />
            </IconButton>
          </Tooltip>
        </Stack>
      )}
      sx={{ minHeight: 52, px: 2 }}
    >
      <ListItemText primary={primary} secondary={secondary} />
    </ListItem>
  )
}
