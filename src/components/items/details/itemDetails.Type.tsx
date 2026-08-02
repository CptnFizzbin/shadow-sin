import Typography from "@mui/material/Typography"
import type { FC, ReactNode } from "react"

export interface ItemDetailsTypeProps {
  label: ReactNode
  subtype?: ReactNode
}

/** Overrides the `type` prop `ItemDetailsRoot` renders by default. */
export const ItemDetailsType: FC<ItemDetailsTypeProps> = ({ label, subtype }) => (
  <Typography variant="h2" sx={{ color: "text.secondary" }}>
    {label}
    {subtype && <> — {subtype}</>}
  </Typography>
)

ItemDetailsType.displayName = "ItemDetails.Type"
