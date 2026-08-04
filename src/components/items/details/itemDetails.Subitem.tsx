import type { FC } from "react"

import { AnyItemCard } from "#/components/itemCard/anyItemCard.tsx"
import type { ItemData } from "#/system/itemData.ts"

export interface ItemDetailsSubitemProps {
  item: ItemData
  /** When provided, the nested card becomes tappable and navigates to this attached item's own details page. */
  onOpen?: () => void
}

/**
 * Attached-item row for ItemDetails. Renders the full nested AnyItemCard rather
 * than a one-line name — attachments are themselves complete Items with
 * their own id, so the higher-fidelity details context shows them as such
 * and lets each one drill into its own details page.
 */
export const ItemDetailsSubitem: FC<ItemDetailsSubitemProps> = ({ item, onOpen }) => (
  <AnyItemCard item={item} onOpen={onOpen} />
)

ItemDetailsSubitem.displayName = "ItemDetails.Subitem"
