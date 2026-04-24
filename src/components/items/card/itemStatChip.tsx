import type { ChipProps } from "@mui/material/Chip"
import Chip from "@mui/material/Chip"
import type { FC } from "react"

interface ItemStatChipProps extends Omit<ChipProps, "size" | "variant"> {
  label: string
}

export const ItemStatChip: FC<ItemStatChipProps> = ({ label, ...props }) => (
  <Chip
    label={label}
    size="small"
    variant="outlined"
    sx={{ height: 20, fontSize: "0.7rem" }}
    {...props}
  />
)
