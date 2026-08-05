import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import MenuItem from "@mui/material/MenuItem"
import type { FC, ReactNode } from "react"

export interface CardElementQuickActionProps {
  label: string
  icon?: ReactNode
  onClick: () => void
  disabled?: boolean
}

/**
 * A single action in an EntityCard's context menu (right-click on desktop,
 * tap-and-hold on mobile). Rendered by the card root inside its menu, not
 * inline in the card body — the element only carries the action's data.
 */
export const CardElementQuickAction: FC<CardElementQuickActionProps> = ({
  label,
  icon,
  onClick,
  disabled,
}) => (
  <MenuItem onClick={onClick} disabled={disabled}>
    {icon && <ListItemIcon>{icon}</ListItemIcon>}
    <ListItemText>{label}</ListItemText>
  </MenuItem>
)

CardElementQuickAction.displayName = "EntityCard.QuickAction"
