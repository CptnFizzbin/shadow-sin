import type { ChipProps } from "@mui/material/Chip"
import type { FC } from "react"

import { StatChip } from "#/components/ui/statChip.tsx"

export type DataCardStatType =
  | "damage"
  | "modifier"
  | "rating"
  | "restriction"
  | "warning"
  | "forbidden"

export interface DataCardStatProps {
  label?: string
  value: string | number
  type?: DataCardStatType
}

const typeChipProps: Partial<Record<DataCardStatType, Partial<Omit<ChipProps, "label">>>> = {
  damage: { color: "secondary" },
  modifier: { color: "info" },
  rating: { color: "primary" },
  warning: { color: "warning" },
  forbidden: { color: "error" },
}

/**
 * Stat/restriction chip slot for DataCard. `type` drives chip color; "restriction"
 * always renders value-only (no label) since it mirrors a bare availability rating
 * (e.g. "8R").
 */
export const DataCardSlotStat: FC<DataCardStatProps> = ({ label, value, type }) => {
  const displayLabel = type === "restriction" || !label ? String(value) : `${label}: ${value}`

  return <StatChip label={displayLabel} {...(type ? typeChipProps[type] : undefined)} />
}

DataCardSlotStat.displayName = "DataCard.Stat"
