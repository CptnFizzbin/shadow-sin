import type { ChipProps } from "@mui/material/Chip"
import Chip from "@mui/material/Chip"
import type { FC } from "react"

interface RatingChipProps extends Omit<ChipProps, "label"> {
  rating: "real" | number | string
}

export const RatingChip: FC<RatingChipProps> = ({ rating, ...props }) => (
  <Chip
    label={rating === "real" ? "Real" : `Rating: ${rating}`}
    size="small"
    variant="outlined"
    sx={{ height: 20, fontSize: "0.7rem" }}
    {...props}
  />
)
