import type { FC } from "react"

import { WeaponItemCard } from "#/components/items/types/weapons/weaponItemCard.tsx"
import type { WeaponData } from "#/system/gear/weaponData.ts"
import type { ItemData } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"

import { BasicItemCard } from "./basicItemCard.tsx"

export interface ItemCardProps {
  item: ItemData
  /** When provided, the whole card becomes tappable/keyboard-activatable and routes to a detail view. */
  onOpen?: () => void
}

/**
 * Renders the typed card for `item.itemType`, falling back to `BasicItemCard`
 * (name only, no slots) for item types without one yet. This is the only
 * module allowed to depend on every typed card — typed cards must depend on
 * `BasicItemCard`/`ItemCardSlot` instead of this file, or importing it here
 * would create a cycle.
 */
export const ItemCard: FC<ItemCardProps> = ({ item, onOpen }) => {
  switch (item.itemType) {
    case ItemType.weapon:
      // The switch narrows `item.itemType`, not `item` itself, since ItemData
      // isn't a discriminated union of per-type interfaces; the case match
      // guarantees the cast is safe.
      return <WeaponItemCard weapon={item as WeaponData} onOpen={onOpen} />

    default:
      return <BasicItemCard name={item.name} onOpen={onOpen} />
  }
}
