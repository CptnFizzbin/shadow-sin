import Typography from "@mui/material/Typography"
import type { FC, ReactNode } from "react"

export interface DataCardTypeProps {
  label: ReactNode
  subtype?: ReactNode
}

/** Small caption above the title — e.g. "Weapon" or "Weapon — Heavy Pistol" when a subtype is given. */
export const DataCardSlotType: FC<DataCardTypeProps> = ({ label, subtype }) => (
  <Typography sx={{ fontSize: "0.7rem", color: "text.secondary" }}>
    {label}
    {subtype && <> — {subtype}</>}
  </Typography>
)

DataCardSlotType.displayName = "DataCard.Type"
