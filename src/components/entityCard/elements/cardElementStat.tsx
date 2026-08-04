import type { ChipProps } from "@mui/material/Chip"
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
  value: string | number
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

/**
 * Stat/restriction chip element. `type` drives chip color; "restriction" always renders
 * value-only (no label) since it mirrors a bare availability rating (e.g. "8R").
 */
export const CardElementStat: FC<CardElementStatProps> = ({ label, value, type }) => {
  const displayLabel = type === "restriction" || !label ? String(value) : `${label}: ${value}`
  const color = type ? typeChipColor[type] : undefined

  return <StatChip label={displayLabel} color={color} />
}

CardElementStat.displayName = "EntityCard.Stat"
