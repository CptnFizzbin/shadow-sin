import Alert from "@mui/material/Alert"
import AlertTitle from "@mui/material/AlertTitle"
import { RiBarricadeFill } from "@remixicon/react"
import type { FC } from "react"

interface UnderConstructionProps {
  title?: string
  description?: string
}

export const UnderConstruction: FC<UnderConstructionProps> = ({ title, description }) => (
  <Alert severity="warning" icon={<RiBarricadeFill />}>
    <AlertTitle>{title ?? "Under Construction"}</AlertTitle>
    {description ?? "We're working hard to bring this feature to you. Stay tuned!"}
  </Alert>
)
