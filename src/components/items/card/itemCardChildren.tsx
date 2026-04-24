import Stack from "@mui/material/Stack"
import type { FC, ReactNode } from "react"
import { Children } from "react"

interface ItemCardChildrenProps {
  children: ReactNode
}

export const ItemCardChildren: FC<ItemCardChildrenProps> = ({ children }) => {
  const childArray = Children.toArray(children)
  if (childArray.length === 0) return null

  return (
    <Stack
      sx={{
        gap: 0,
        padding: 0,
        borderLeft: "4px solid",
        borderBottom: "1px solid",
        borderColor: "secondary.dark",
      }}
    >
      {childArray}
    </Stack>
  )
}

ItemCardChildren.displayName = "ItemCard.Children"
