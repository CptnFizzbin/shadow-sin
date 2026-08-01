import Typography from "@mui/material/Typography"
import type { FC, ReactNode } from "react"

export interface DataCardTitleProps {
  title: ReactNode
}

export const DataCardSlotTitle: FC<DataCardTitleProps> = ({ title }) => (
  <Typography sx={{ fontWeight: 500 }}>{title}</Typography>
)

DataCardSlotTitle.displayName = "DataCard.Title"
