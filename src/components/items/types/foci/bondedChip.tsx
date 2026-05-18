import Chip from "@mui/material/Chip"
import type { FC } from "react"

export const BondedChip: FC = () => (
  <Chip
    label="Bonded"
    size="small"
    color="info"
    sx={{ height: 20, fontSize: "0.7rem" }}
  />
)
