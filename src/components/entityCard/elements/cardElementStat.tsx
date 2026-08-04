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

const typeChipProps = {
  damage: { color: "secondary" },
  modifier: { color: "info" },
  rating: { color: "primary" },
  warning: { color: "warning" },
  forbidden: { color: "error" },
} satisfies Partial<Record<CardElementStatType, Partial<Omit<ChipProps, "label">>>>

/**
 * Stat/restriction chip element. `type` drives chip color; "restriction" always renders
 * value-only (no label) since it mirrors a bare availability rating (e.g. "8R").
 */
export const CardElementStat: FC<CardElementStatProps> = ({ label, value, type }) => {
  const displayLabel = type === "restriction" || !label ? String(value) : `${label}: ${value}`
  const chipProps: Partial<Omit<ChipProps, "label">> | undefined = type
    ? (typeChipProps as Partial<Record<CardElementStatType, Partial<Omit<ChipProps, "label">>>>)[type]
    : undefined

  return <StatChip label={displayLabel} {...chipProps} />
}

CardElementStat.displayName = "EntityCard.Stat"
