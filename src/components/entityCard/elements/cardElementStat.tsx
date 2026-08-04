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

const typeChipProps: Partial<Record<CardElementStatType, Partial<Omit<ChipProps, "label">>>> = {
  damage: { color: "secondary" },
  modifier: { color: "info" },
  rating: { color: "primary" },
  warning: { color: "warning" },
  forbidden: { color: "error" },
}

/**
 * Stat/restriction chip element. `type` drives chip color; "restriction" always renders
 * value-only (no label) since it mirrors a bare availability rating (e.g. "8R").
 */
export const CardElementStat: FC<CardElementStatProps> = ({ label, value, type }) => {
  const displayLabel = type === "restriction" || !label ? String(value) : `${label}: ${value}`

  return <StatChip label={displayLabel} {...(type ? typeChipProps[type] : undefined)} />
}

CardElementStat.displayName = "EntityCard.Stat"
