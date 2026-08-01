import type { FC } from "react"

import { ItemCard } from "#/components/items/card-redesign/itemCard.tsx"
import type { ItemData } from "#/system/itemData.ts"

export interface ItemDetailsSubitemProps {
  item: ItemData
  /** When provided, the nested card becomes tappable and navigates to this attached item's own details page. */
  onOpen?: () => void
}

/**
 * Attached-item row for ItemDetails. Renders the full nested ItemCard rather
 * than a one-line name — attachments are themselves complete Items with
 * their own id, so the higher-fidelity details context shows them as such
 * and lets each one drill into its own details page.
 */
export const ItemDetailsSubitem: FC<ItemDetailsSubitemProps> = ({ item, onOpen }) => (
  <ItemCard item={item} onOpen={onOpen} />
)

ItemDetailsSubitem.displayName = "ItemDetails.Subitem"
