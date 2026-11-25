import Typography from "@mui/material/Typography"
import type { FC, ReactNode } from "react"

export interface CardElementTitleProps {
  title: ReactNode
}

export const CardElementTitle: FC<CardElementTitleProps> = ({ title }) => (
  <Typography sx={{ fontWeight: 500 }}>{title}</Typography>
)

CardElementTitle.displayName = "EntityCard.Title"
