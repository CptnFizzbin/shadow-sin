import Button from "@mui/material/Button"
import { RiAddLine } from "@remixicon/react"
import type { FC } from "react"

interface GearSectionAddButtonProps {
  label: string
  onClick: () => void
}

export const GearSectionAddButton: FC<GearSectionAddButtonProps> = ({
  label,
  onClick,
}) => (
  <Button
    variant="outlined"
    size="small"
    startIcon={<RiAddLine size={14} />}
    onClick={onClick}
    color="secondary"
    fullWidth
  >
    {label}
  </Button>
)
