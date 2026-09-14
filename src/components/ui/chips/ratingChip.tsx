import type { ChipProps } from "@mui/material/Chip"
import type { FC } from "react"

import { StatChip } from "./statChip.tsx"

interface RatingChipProps extends Omit<ChipProps, "label"> {
  isReal: boolean
  /** Ignored (and may be a placeholder) when `isReal` is `true`. */
  rating: number
}

export const RatingChip: FC<RatingChipProps> = ({ isReal, rating, ...props }) => (
  <StatChip label={isReal ? "Real" : `Rating: ${rating}`} {...props} />
)
