import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import MenuItem from "@mui/material/MenuItem"
import type { FC, ReactNode } from "react"

export interface CardElementActionProps {
  label: string
  icon?: ReactNode
  onClick: () => void
  disabled?: boolean
}

/** Inline interaction affordance on an EntityCard — e.g. "Cast", "Roll Attack". */
export const CardElementAction: FC<CardElementActionProps> = ({ label, icon, onClick, disabled }) => (
  <MenuItem onClick={onClick} disabled={disabled}>
    {icon && <ListItemIcon>{icon}</ListItemIcon>}
    <ListItemText>{label}</ListItemText>
  </MenuItem>
)

CardElementAction.displayName = "EntityCard.Action"
