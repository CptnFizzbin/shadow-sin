import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import MenuItem from "@mui/material/MenuItem"
import type { FC, ReactNode } from "react"

export interface DataCardQuickActionProps {
  label: string
  icon?: ReactNode
  onClick: () => void
  disabled?: boolean
}

/**
 * A single action in DataCard's context menu (right-click on desktop,
 * tap-and-hold on mobile). Rendered by DataCard inside its menu, not
 * inline in the card body — the slot only carries the action's data.
 */
export const DataCardSlotContextAction: FC<DataCardQuickActionProps> = ({
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

DataCardSlotContextAction.displayName = "DataCard.QuickAction"
