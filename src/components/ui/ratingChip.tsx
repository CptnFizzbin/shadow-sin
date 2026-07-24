import type { ChipProps } from "@mui/material/Chip"
import type { FC } from "react"

import { StatChip } from "./statChip.tsx"

interface RatingChipProps extends Omit<ChipProps, "label"> {
  rating: "real" | number | string
}

export const RatingChip: FC<RatingChipProps> = ({ rating, ...props }) => (
  <StatChip label={rating === "real" ? "Real" : `Rating: ${rating}`} {...props} />
)
