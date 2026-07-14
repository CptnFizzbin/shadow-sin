import Chip from "@mui/material/Chip"
import IconButton from "@mui/material/IconButton"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemText from "@mui/material/ListItemText"
import Stack from "@mui/material/Stack"
import Tooltip from "@mui/material/Tooltip"
import { RiCheckLine, RiStarLine } from "@remixicon/react"
import type { FC, ReactNode } from "react"

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

interface ImprovementSpecSkillRowProps {
  skillName: string
  secondaryText: ReactNode
  /** Chip label shown once the skill is at its rating cap, e.g. "Max" or "Native". */
  maxChipLabel: string
  isAtMax: boolean
  karmaCost: number
  isImproveQueued: boolean
  canAffordImprove: boolean
  onToggleImprove: () => void
  isLastRow: boolean
  /** Noun used in the specialization/lingo tooltips and aria-labels. */
  specNoun: string
  specCost: number
  isSpecQueued: boolean
  canAffordSpec: boolean
  queuedSpecLabel?: string
  onToggleSpec: () => void
  onEditSpec: () => void
}

/**
 * Shared row for the knowledge-skill and language-skill improvement lists:
 * an "improve rating" button plus a specialization/lingo toggle. Active
 * skills use `ImprovementActiveSkillRow` instead — its cost math and
 * skill-group warning icon don't apply here.
 */
export const ImprovementSpecSkillRow: FC<ImprovementSpecSkillRowProps> = ({
  skillName,
  secondaryText,
  maxChipLabel,
  isAtMax,
  karmaCost,
  isImproveQueued,
  canAffordImprove,
  onToggleImprove,
  isLastRow,
  specNoun,
  specCost,
  isSpecQueued,
  canAffordSpec,
  queuedSpecLabel,
  onToggleSpec,
  onEditSpec,
}) => {
  const improveDisabled = isAtMax || (!canAffordImprove && !isImproveQueued)

  return (
    <ListItem
      disablePadding
      divider={!isLastRow}
      secondaryAction={(
        <Stack direction="row" sx={{ alignItems: "center", gap: 0.5 }}>
          {isAtMax
            ? <Chip label={maxChipLabel} size="small" />
            : (
                <Chip
                  label={`${karmaCost}k`}
                  size="small"
                  color={isImproveQueued ? "success" : canAffordImprove ? "default" : "warning"}
                />
              )}
          {isImproveQueued && (
            <RiCheckLine size={14} style={{ color: "var(--mui-palette-success-main)" }} />
          )}
          {isSpecQueued && queuedSpecLabel && (
            <Tooltip title={`Edit ${specNoun}`}>
              <Chip
                label={queuedSpecLabel}
                size="small"
                color="success"
                variant="outlined"
                onClick={onEditSpec}
                sx={{ cursor: "pointer", maxWidth: 160 }}
              />
            </Tooltip>
          )}
          <Tooltip title={isSpecQueued ? `Remove ${specNoun}` : `${capitalize(specNoun)} (${specCost}k)`}>
            <span>
              <IconButton
                size="small"
                aria-label={isSpecQueued ? `Remove ${specNoun}` : `Add ${specNoun}`}
                aria-pressed={isSpecQueued}
                color={isSpecQueued ? "success" : "default"}
                disabled={!canAffordSpec && !isSpecQueued}
                onClick={onToggleSpec}
              >
                <RiStarLine size={16} />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
      )}
    >
      <ListItemButton
        aria-label="Improve rating"
        aria-pressed={isImproveQueued}
        disabled={improveDisabled}
        onClick={onToggleImprove}
        sx={{
          minHeight: 52,
          opacity: improveDisabled && !isImproveQueued && !isAtMax ? 0.45 : 1,
        }}
      >
        <ListItemText primary={skillName} secondary={secondaryText} />
      </ListItemButton>
    </ListItem>
  )
}
