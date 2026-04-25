import Stack from "@mui/material/Stack"
import type { FC, ReactNode } from "react"

import { ItemListAddItemButton } from "#/components/items/card/itemListAddItemButton.tsx"

interface ItemListProps {
  children: ReactNode
}

interface ItemListComponent extends FC<ItemListProps> {
  AddItemButton: typeof ItemListAddItemButton
}

const ItemListRoot: FC<ItemListProps> = ({ children }) => (
  <Stack sx={{ gap: 1 }}>{children}</Stack>
)

export const ItemList = ItemListRoot as ItemListComponent
ItemList.AddItemButton = ItemListAddItemButton
