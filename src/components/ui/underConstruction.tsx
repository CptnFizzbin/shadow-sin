import Alert from "@mui/material/Alert"
import AlertTitle from "@mui/material/AlertTitle"
import type { FC } from "react"

interface UnderConstructionProps {
  title: string
  description: string
}

export const UnderConstruction: FC<UnderConstructionProps> = ({ title, description }) => (
  <Alert severity="info" sx={{ py: 0 }}>
    <AlertTitle>{title}</AlertTitle>
    {description}
  </Alert>
)
