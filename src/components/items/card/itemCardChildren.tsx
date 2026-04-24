import Stack from "@mui/material/Stack"
import type { FC, ReactNode } from "react"

interface ItemCardChildrenProps {
  children: ReactNode
}

export const ItemCardChildren: FC<ItemCardChildrenProps> = ({ children }) => (
  <Stack
    sx={{
      gap: 1,
      paddingTop: 1,
      paddingLeft: 1,
      paddingBottom: 1,
      borderLeft: "8px solid",
      borderBottom: "1px solid",
      borderColor: "divider",
    }}
  >
    {children}
  </Stack>
)

ItemCardChildren.displayName = "ItemCard.Children"
