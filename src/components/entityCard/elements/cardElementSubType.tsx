import Typography from "@mui/material/Typography"
import type { FC, ReactNode } from "react"

export interface CardElementSubTypeProps {
  label: ReactNode
}

/**
 * Secondary type label distinct from an Entity's main Type badge — e.g. a Device's category, a
 * Vehicle's model, or an Implant's cyber/bio kind. Formalizes what Device/Vehicle/Implant/
 * Credstick each derived as their own ad hoc "subtype" string before this migration.
 */
export const CardElementSubType: FC<CardElementSubTypeProps> = ({ label }) => (
  <Typography sx={{ fontSize: "0.7rem", color: "text.secondary" }}>{label}</Typography>
)

CardElementSubType.displayName = "ItemCard.SubType"
