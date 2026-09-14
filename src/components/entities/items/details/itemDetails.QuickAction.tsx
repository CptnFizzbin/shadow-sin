import Button from "@mui/material/Button"
import type { FC, ReactNode } from "react"

export interface ItemDetailsQuickActionProps {
  label: string
  icon?: ReactNode
  onClick: () => void
  disabled?: boolean
}

/**
 * A single action button on the ItemDetails page. Unlike DataCard's
 * long-press/right-click menu (a space-saving affordance for a compact
 * card), the details page has room for actions to be persistently visible
 * buttons in the header action row.
 */
export const ItemDetailsQuickAction: FC<ItemDetailsQuickActionProps> = ({
  label,
  icon,
  onClick,
  disabled,
}) => (
  <Button variant="outlined" size="small" startIcon={icon} onClick={onClick} disabled={disabled}>
    {label}
  </Button>
)

ItemDetailsQuickAction.displayName = "ItemDetails.QuickAction"
