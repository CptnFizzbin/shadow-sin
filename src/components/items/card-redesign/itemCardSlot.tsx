import { ItemCardDamageTrack } from "./itemCard.DamageTrack.tsx"
import { ItemCardFooter } from "./itemCard.Footer.tsx"
import { ItemCardQuickAction } from "./itemCard.QuickAction.tsx"
import { ItemCardStat } from "./itemCard.Stat.tsx"
import { ItemCardStatusIcons } from "./itemCard.StatusIcons.tsx"
import { ItemCardSubitem } from "./itemCard.Subitem.tsx"

export type { ItemCardQuickActionProps } from "./itemCard.QuickAction.tsx"
export type { ItemCardStatProps, ItemCardStatType } from "./itemCard.Stat.tsx"
export type { ItemCardStatusIconsProps } from "./itemCard.StatusIcons.tsx"
export type { ItemCardSubitemProps, ItemCardSubitemStat } from "./itemCard.Subitem.tsx"

/**
 * Slot components for composing an ItemCard body (BasicItemCard or a typed
 * card wrapping it). Kept separate from the `ItemCard` dispatcher so typed
 * cards can depend on slots without depending on `ItemCard` itself, which
 * would otherwise import every typed card and create a cycle.
 *
 * `Source` isn't here: BasicItemCard renders it directly from `item.source`
 * since every `ItemData` carries one, so it's no longer a composable slot.
 */
export const ItemCardSlot = {
  Stat: ItemCardStat,
  Subitem: ItemCardSubitem,
  DamageTrack: ItemCardDamageTrack,
  Footer: ItemCardFooter,
  StatusIcons: ItemCardStatusIcons,
  QuickAction: ItemCardQuickAction,
}
