import Chip from "@mui/material/Chip"
import type { FC } from "react"

export const ActiveChip: FC = () => (
  <Chip
    label="Active"
    size="small"
    color="success"
    sx={{ height: 20, fontSize: "0.7rem" }}
  />
)
