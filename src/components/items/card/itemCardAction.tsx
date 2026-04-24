import type { FC, ReactNode } from "react"

export type ItemCardActionType = "button" | "icon"

interface ItemCardActionProps {
  type: ItemCardActionType
  onClick?: () => void
  children: ReactNode
}

/**
 * Action slot for ItemCard.
 * - "icon"   → rendered right of title row (after cost metas)
 * - "button" → rendered full-width below meta rows
 */
export const ItemCardAction: FC<ItemCardActionProps> = ({ children }) => (
  // Rendering is handled by ItemCardRoot which reads the type prop via React.Children

  <>{children}</>
)

ItemCardAction.displayName = "ItemCard.Action"
