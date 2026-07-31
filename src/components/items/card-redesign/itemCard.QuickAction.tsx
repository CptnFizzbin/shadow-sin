import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import MenuItem from "@mui/material/MenuItem"
import type { FC, ReactNode } from "react"

export interface ItemCardQuickActionProps {
  label: string
  icon?: ReactNode
  onClick: () => void
  disabled?: boolean
}

/**
 * A single action in ItemCard's context menu (right-click on desktop,
 * tap-and-hold on mobile). Rendered by BasicItemCard inside its menu, not
 * inline in the card body — the slot only carries the action's data.
 */
export const ItemCardQuickAction: FC<ItemCardQuickActionProps> = ({
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

ItemCardQuickAction.displayName = "ItemCard.QuickAction"
