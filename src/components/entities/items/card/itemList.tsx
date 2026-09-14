import Stack from "@mui/material/Stack"
import type { FC, ReactNode } from "react"

import { ItemListAddItemButton } from "./itemListAddItemButton.tsx"

interface ItemListProps {
  children: ReactNode
}

interface ItemListComponent extends FC<ItemListProps> {
  AddItemButton: typeof ItemListAddItemButton
}

const ItemListRoot: FC<ItemListProps> = ({ children }) => (
  <Stack>{children}</Stack>
)

export const ItemList = ItemListRoot as ItemListComponent
ItemList.AddItemButton = ItemListAddItemButton
