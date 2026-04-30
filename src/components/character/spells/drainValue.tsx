import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { formatDrainFormula } from "./spellDrainFormula.ts"

interface DrainValueProps {
  mod: number
}

export const DrainValue: FC<DrainValueProps> = ({ mod }) => (
  <Typography color="text.secondary">{formatDrainFormula(mod)}</Typography>
)
