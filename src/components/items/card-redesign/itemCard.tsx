import type { FC } from "react"

import { ItemCardDamageTrack } from "./itemCardDamageTrack.tsx"
import { ItemCardFooter } from "./itemCardFooter.tsx"
import type { ItemCardRootProps } from "./itemCardRoot.tsx"
import { ItemCardRoot } from "./itemCardRoot.tsx"
import { ItemCardSource } from "./itemCardSource.tsx"
import { ItemCardStat } from "./itemCardStat.tsx"
import { ItemCardSubitem } from "./itemCardSubitem.tsx"

export type { ItemCardRootProps } from "./itemCardRoot.tsx"
export type { ItemCardStatProps, ItemCardStatType } from "./itemCardStat.tsx"
export type { ItemCardStatusIconsProps } from "./itemCardStatusIcons.tsx"
export type { ItemCardSubitemProps, ItemCardSubitemStat } from "./itemCardSubitem.tsx"

export type ItemCardProps = ItemCardRootProps

interface ItemCardComponent extends FC<ItemCardProps> {
  Stat: typeof ItemCardStat
  Subitem: typeof ItemCardSubitem
  Source: typeof ItemCardSource
  DamageTrack: typeof ItemCardDamageTrack
  Footer: typeof ItemCardFooter
}

const ItemCardBase: FC<ItemCardProps> = ({ ...props }) => <ItemCardRoot {...props} />

/**
 * Slot-based item card (redesign). Compose with `ItemCard.Stat`, `.Subitem`,
 * `.Source`, `.DamageTrack`, and `.Footer` children; unrecognized children are
 * ignored by the root layout.
 */
export const ItemCard = ItemCardBase as ItemCardComponent
ItemCard.Stat = ItemCardStat
ItemCard.Subitem = ItemCardSubitem
ItemCard.Source = ItemCardSource
ItemCard.DamageTrack = ItemCardDamageTrack
ItemCard.Footer = ItemCardFooter
