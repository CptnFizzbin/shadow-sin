import Button from "@mui/material/Button"
import { RiAddLine } from "@remixicon/react"
import type { FC } from "react"

interface ItemListAddItemButtonProps {
  onClick: () => void
  children: string
}

export const ItemListAddItemButton: FC<ItemListAddItemButtonProps> = ({
  onClick,
  children,
}) => (
  <Button
    variant="outlined"
    color="secondary"
    size="small"
    startIcon={<RiAddLine size={14} />}
    onClick={onClick}
    fullWidth
    sx={{
      borderStyle: "dashed",
    }}
  >
    {children}
  </Button>
)

ItemListAddItemButton.displayName = "ItemList.AddItemButton"
