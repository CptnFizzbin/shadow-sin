import type { ChipProps } from "@mui/material/Chip"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { StatChip } from "#/components/ui/statChip.tsx"

export type CardElementStatType =
  | "damage"
  | "modifier"
  | "rating"
  | "restriction"
  | "warning"
  | "forbidden"

export interface CardElementStatProps {
  label?: string
  value: string | number | undefined
  /**
   * Overrides `value` for display when a modifier changes the stat's effective value (e.g. an
   * Implant grade's essence multiplier). When it differs from `value`, both render — `value`
   * struck through, `effectiveValue` in the chip — instead of the caller pre-computing one value
   * and discarding the other before this element ever sees it.
   */
  effectiveValue?: string | number
  type?: CardElementStatType
}

const typeChipColor = {
  damage: "secondary",
  modifier: "info",
  rating: "primary",
  restriction: undefined,
  warning: "warning",
  forbidden: "error",
} satisfies Record<CardElementStatType, ChipProps["color"]>

function statLabel(label: string | undefined, value: string | number, type: CardElementStatType | undefined) {
  return type === "restriction" || !label ? String(value) : `${label}: ${value}`
}

/**
 * Stat/restriction chip element. `type` drives chip color; "restriction" always renders
 * value-only (no label) since it mirrors a bare availability rating (e.g. "8R"). `value` is
 * optional (unlike most of this element's props) so call sites with an optional stat field don't
 * each need their own `value !== undefined &&` guard — matching `CardElementCost`,
 * `CardElementQuantity`, and `CardElementRating`, which self-guard the same way.
 */
export const CardElementStat: FC<CardElementStatProps> = ({ label, value, effectiveValue, type }) => {
  if (value === undefined) return null

  const color = type ? typeChipColor[type] : undefined
  const isModified = effectiveValue !== undefined && effectiveValue !== value

  if (!isModified) return <StatChip label={statLabel(label, effectiveValue ?? value, type)} color={color} />

  return (
    <Stack direction="row" sx={{ gap: 0.5, alignItems: "center" }}>
      <Typography
        component="span"
        sx={{ fontSize: "0.7rem", color: "text.disabled", textDecoration: "line-through" }}
      >
        {statLabel(label, value, type)}
      </Typography>
      <StatChip label={statLabel(label, effectiveValue, type)} color={color} />
    </Stack>
  )
}

CardElementStat.displayName = "EntityCard.Stat"
