import { ItemCardDamageTrack } from "./itemCard.DamageTrack.tsx"
import { ItemCardFooter } from "./itemCard.Footer.tsx"
import { ItemCardSource } from "./itemCard.Source.tsx"
import { ItemCardStat } from "./itemCard.Stat.tsx"
import { ItemCardStatusIcons } from "./itemCard.StatusIcons.tsx"
import { ItemCardSubitem } from "./itemCard.Subitem.tsx"

export type { ItemCardStatProps, ItemCardStatType } from "./itemCard.Stat.tsx"
export type { ItemCardStatusIconsProps } from "./itemCard.StatusIcons.tsx"
export type { ItemCardSubitemProps, ItemCardSubitemStat } from "./itemCard.Subitem.tsx"

/**
 * Slot components for composing an ItemCard body (BasicItemCard or a typed
 * card wrapping it). Kept separate from the `ItemCard` dispatcher so typed
 * cards can depend on slots without depending on `ItemCard` itself, which
 * would otherwise import every typed card and create a cycle.
 */
export const ItemCardSlot = {
  Stat: ItemCardStat,
  Subitem: ItemCardSubitem,
  Source: ItemCardSource,
  DamageTrack: ItemCardDamageTrack,
  Footer: ItemCardFooter,
  StatusIcons: ItemCardStatusIcons,
}
