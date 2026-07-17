import Box from "@mui/material/Box"
import Chip from "@mui/material/Chip"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemText from "@mui/material/ListItemText"
import Stack from "@mui/material/Stack"
import Tooltip from "@mui/material/Tooltip"
import Typography from "@mui/material/Typography"
import { RiCheckLine, RiFlashlightLine } from "@remixicon/react"
import type { FC } from "react"

import { KarmaChip } from "#/components/runner/karma/karmaChip.tsx"
import type { SkillKey } from "#/system/skills/skillKey.ts"

interface ImprovementActiveSkillRowProps {
  skillName: SkillKey
  rating: number
  /** Maximum rating this skill can reach (6 normally, 7 with Aptitude). */
  cap: number
  /** Whether the runner has the Aptitude quality for this skill — drives double-cost beyond 6. */
  hasAptitude: boolean
  isGrouped: boolean
  isLastRow: boolean
  remainingKarma: number
  isImproveQueued: boolean
  onToggleImprove: () => void
}

export const ImprovementActiveSkillRow: FC<ImprovementActiveSkillRowProps> = ({
  skillName,
  rating,
  cap,
  hasAptitude,
  isGrouped,
  isLastRow,
  remainingKarma,
  isImproveQueued,
  onToggleImprove,
}) => {
  const nextRating = rating + 1
  const baseStepCost = nextRating * 2
  const improveCost = hasAptitude && nextRating > 6 ? baseStepCost * 2 : baseStepCost
  const isAtMax = rating >= cap
  const canAffordImprove = isImproveQueued || improveCost <= remainingKarma
  const improveDisabled = isAtMax || (!canAffordImprove && !isImproveQueued)

  const primaryLabel = (
    <Box component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}>
      {skillName}
      {isGrouped && (
        <Tooltip title="Belongs to a skill group — improving will break the group">
          <Box component="span" sx={{ color: "warning.main", fontSize: "0.85em" }}>⚠</Box>
        </Tooltip>
      )}
    </Box>
  )

  return (
    <ListItem
      disablePadding
      divider={!isLastRow}
      secondaryAction={(
        <Stack direction="row" sx={{ alignItems: "center", gap: 0.5 }}>
          {isAtMax
            ? <Chip label="Max" size="small" />
            : (
                <KarmaChip
                  amount={improveCost}
                  size="small"
                  color={isImproveQueued ? "success" : canAffordImprove ? "default" : "warning"}
                />
              )}
          {isImproveQueued && (
            <RiCheckLine size={14} style={{ color: "var(--mui-palette-success-main)" }} />
          )}
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
        <ListItemText
          primary={primaryLabel}
          secondary={isAtMax
            ? (
                <Typography variant="caption" color="text.secondary">
                  Rating
                  {" "}
                  {rating}
                </Typography>
              )
            : (
                <Typography variant="caption" color="text.secondary">
                  <RiFlashlightLine
                    size={11}
                    style={{ verticalAlign: "middle", marginRight: 4 }}
                  />
                  {rating}
                  {" → "}
                  {rating + 1}
                </Typography>
              )}
        />
      </ListItemButton>
    </ListItem>
  )
}
