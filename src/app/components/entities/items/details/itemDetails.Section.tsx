import type { FC, ReactNode } from "react"

export interface ItemDetailsSectionProps {
  children: ReactNode
}

/**
 * Freeform block rendered above the attachments list, for content that belongs with the item's
 * attachments rather than at the bottom of the page (e.g. the Programs on a device).
 */
export const ItemDetailsSection: FC<ItemDetailsSectionProps> = ({ children }) => <>{children}</>

ItemDetailsSection.displayName = "ItemDetails.Section"
