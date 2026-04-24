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
    variant="text"
    color="secondary"
    size="small"
    startIcon={<RiAddLine size={14} />}
    onClick={(e) => {
      e.stopPropagation()
      onClick(e)
    }}
    fullWidth
  >
    {children}
  </Button>
)

ItemCardAddChildButton.displayName = "ItemCard.AddChildButton"
