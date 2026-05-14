import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import ButtonGroup from "@mui/material/ButtonGroup"
import Chip from "@mui/material/Chip"
import Stack from "@mui/material/Stack"
import Tooltip from "@mui/material/Tooltip"
import Typography from "@mui/material/Typography"
import { RiFlashlightLine, RiStarLine } from "@remixicon/react"
import type { FC } from "react"

import type { SkillKey } from "#/system/skills/skillKey.ts"

const MAX_SKILL_RATING = 6

interface ImprovementActiveSkillRowProps {
  skillName: SkillKey
  rating: number
  isGrouped: boolean
  remainingKarma: number
  isImproveQueued: boolean
  isSpecQueued: boolean
  onToggleImprove: () => void
  onToggleSpec: () => void
}

export const ImprovementActiveSkillRow: FC<ImprovementActiveSkillRowProps> = ({
  skillName,
  rating,
  isGrouped,
  remainingKarma,
  isImproveQueued,
  isSpecQueued,
  onToggleImprove,
  onToggleSpec,
}) => {
  const improveCost = (rating + 1) * 2
  const specCost = 2
  const isAtMax = rating >= MAX_SKILL_RATING
  const canAffordImprove = isImproveQueued || improveCost <= remainingKarma
  const canAffordSpec = isSpecQueued || specCost <= remainingKarma

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.75,
        px: 1,
        py: 0.75,
        borderRadius: 1,
        border: "1px solid",
        borderColor: "divider",
        opacity: (!canAffordImprove && !isImproveQueued && !isAtMax) ? 0.45 : 1,
      }}
    >
      <RiFlashlightLine
        size={14}
        style={{ color: "var(--mui-palette-success-main)", flexShrink: 0 }}
      />

      <Typography variant="body2" sx={{ flex: 1 }}>
        {skillName}
        {isGrouped && (
          <Typography
            component="span"
            variant="caption"
            color="warning.main"
            sx={{ ml: 0.5 }}
          >
            ⚠
          </Typography>
        )}
      </Typography>

      <Typography variant="caption" color="text.secondary">
        {rating}
      </Typography>

      {isAtMax
        ? (
            <Stack direction="row" sx={{ gap: 0.5, alignItems: "center" }}>
              <Chip label="Max" size="small" />
              <Tooltip title={`Specialization (${specCost}k)`}>
                <span>
                  <Button
                    size="small"
                    variant="outlined"
                    aria-label="Add specialization"
                    aria-pressed={isSpecQueued}
                    color={isSpecQueued ? "success" : "primary"}
                    disabled={!canAffordSpec}
                    onClick={onToggleSpec}
                    sx={{ minWidth: 0, px: 0.75 }}
                  >
                    <RiStarLine size={13} />
                  </Button>
                </span>
              </Tooltip>
            </Stack>
          )
        : (
            <ButtonGroup size="small" variant="outlined">
              <Tooltip title={`Improve (${improveCost}k)`}>
                <span>
                  <Button
                    aria-label="Improve rating"
                    aria-pressed={isImproveQueued}
                    color={isImproveQueued ? "success" : "primary"}
                    disabled={!canAffordImprove}
                    onClick={onToggleImprove}
                    sx={{ minWidth: 0, px: 0.75 }}
                  >
                    <RiFlashlightLine size={13} />
                  </Button>
                </span>
              </Tooltip>
              <Tooltip title={`Specialization (${specCost}k)`}>
                <span>
                  <Button
                    aria-label="Add specialization"
                    aria-pressed={isSpecQueued}
                    color={isSpecQueued ? "success" : "primary"}
                    disabled={!canAffordSpec}
                    onClick={onToggleSpec}
                    sx={{ minWidth: 0, px: 0.75 }}
                  >
                    <RiStarLine size={13} />
                  </Button>
                </span>
              </Tooltip>
            </ButtonGroup>
          )}
    </Box>
  )
}
