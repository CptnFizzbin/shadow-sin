import Button from "@mui/material/Button"
import { RiAddLine } from "@remixicon/react"
import type { FC, MouseEvent } from "react"

interface ItemCardAddChildButtonProps {
  onClick: (e: MouseEvent<HTMLButtonElement>) => void
  children: string
}

export const ItemCardAddChildButton: FC<ItemCardAddChildButtonProps> = ({
  onClick,
  children,
}) => (
  <Button
    color="secondary"
    startIcon={<RiAddLine size={14} />}
    onClick={onClick}
    fullWidth
  >
    {children}
  </Button>
)

ItemCardAddChildButton.displayName = "ItemCard.AddChildButton"
