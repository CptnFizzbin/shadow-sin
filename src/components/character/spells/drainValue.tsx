import Typography from "@mui/material/Typography"
import type { FC } from "react"

import type { SpellData } from "#/system/magic/spellData.ts"

import { formatDrainFormula } from "./spellDrainFormula.ts"

interface DrainValueProps {
  spell: SpellData
}

export const DrainValue: FC<DrainValueProps> = ({ spell }) => (
  <Typography color="text.secondary">{formatDrainFormula(spell)}</Typography>
)
