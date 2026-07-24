import type { ChipProps } from "@mui/material/Chip"
import Chip from "@mui/material/Chip"
import type { FC } from "react"

export interface StatChipProps extends Omit<ChipProps, "size" | "variant"> {
  label: string
}

/** Small outlined chip used for compact stat/metadata labels (rating, availability, source, etc). */
export const StatChip: FC<StatChipProps> = ({ label, ...props }) => (
  <Chip
    label={label}
    size="small"
    variant="outlined"
    sx={{ height: 20, fontSize: "0.7rem" }}
    {...props}
  />
)
