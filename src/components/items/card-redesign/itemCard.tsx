import type { FC } from "react"

import { WeaponItemCard } from "#/components/items/types/weapons/weaponItemCard.tsx"
import type { WeaponData } from "#/system/gear/weaponData.ts"
import type { ItemData } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"

import { BasicItemCard } from "./basicItemCard.tsx"

export interface ItemCardProps {
  item: ItemData
  /** When provided, the whole card becomes tappable/keyboard-activatable and doubles as the "Edit" quick action. */
  onOpen?: () => void
  /** When provided, adds a "Remove" quick action. Ignored by typed cards that manage their own removal. */
  onRemove?: () => void
}

/**
 * Renders the typed card for `item.itemType`, falling back to `BasicItemCard`
 * (common fields only, no type-specific slots) for item types without one
 * yet. This is the only module allowed to depend on every typed card — typed
 * cards must depend on `BasicItemCard`/`ItemCardSlot` instead of this file,
 * or importing it here would create a cycle.
 */
export const ItemCard: FC<ItemCardProps> = ({ item, onOpen, onRemove }) => {
  switch (item.itemType) {
    case ItemType.weapon:
      // The switch narrows `item.itemType`, not `item` itself, since ItemData
      // isn't a discriminated union of per-type interfaces; the case match
      // guarantees the cast is safe.
      return <WeaponItemCard weapon={item as WeaponData} onOpen={onOpen} />

    default:
      return <BasicItemCard item={item} onOpen={onOpen} onRemove={onRemove} />
  }
}
