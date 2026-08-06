import Button from "@mui/material/Button"
import type { FC, ReactNode } from "react"

export interface CardElementActionProps {
  label: string
  icon?: ReactNode
  onClick: () => void
  disabled?: boolean
}

/** Inline interaction affordance on an EntityCard — e.g. "Cast", "Roll Attack". */
export const CardElementAction: FC<CardElementActionProps> = ({ label, icon, onClick, disabled }) => (
  <Button size="small" startIcon={icon} onClick={onClick} disabled={disabled}>
    {label}
  </Button>
)

CardElementAction.displayName = "EntityCard.Action"
