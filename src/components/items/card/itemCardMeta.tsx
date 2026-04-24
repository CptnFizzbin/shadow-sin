import type { FC, ReactNode } from "react"

export type ItemCardMetaType = "cost" | "stat" | "source"

interface ItemCardMetaProps {
  type: ItemCardMetaType
  children: ReactNode
}

/**
 * Meta slot for ItemCard.
 * - "cost"   → rendered right of title, before icon actions
 * - "stat"   → rendered bottom-left below title row
 * - "source" → rendered bottom-right below title row
 */
export const ItemCardMeta: FC<ItemCardMetaProps> = ({ children }) => (
  // Rendering is handled by ItemCardRoot which reads the type prop via React.Children

  <>{children}</>
)

ItemCardMeta.displayName = "ItemCard.Meta"
