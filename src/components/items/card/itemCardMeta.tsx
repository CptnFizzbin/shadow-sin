import Stack from "@mui/material/Stack"
import type { FC, PropsWithChildren } from "react"

type ItemCardMetaType = "cost" | "stat" | "source" | "detail"

interface ItemCardMetaProps extends PropsWithChildren {
  type: ItemCardMetaType
}

/**
 * Meta slot for ItemCard.
 * - "cost"   → rendered right of title, before icon actions
 * - "stat"   → rendered bottom-left below title row
 * - "source" → rendered bottom-right below title row
 * - "detail" → rendered full-width below the stat/source row, for content
 *              too large for an inline chip (e.g. a multi-line stat block)
 */
export const ItemCardMeta: FC<ItemCardMetaProps> = ({ type, children }) => {
  switch (type) {
    case "cost":
      return (
        <Stack
          direction="row"
          sx={{ minWidth: 75, justifyContent: "flex-end", textAlign: "right" }}
        >
          {children}
        </Stack>
      )
    default:
      return children
  }
}

ItemCardMeta.displayName = "ItemCard.Meta"
