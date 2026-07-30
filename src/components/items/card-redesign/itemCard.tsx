import type { FC } from "react"

import { ItemCardDamageTrack } from "./itemCard.DamageTrack.tsx"
import { ItemCardFooter } from "./itemCard.Footer.tsx"
import type { ItemCardRootProps } from "./itemCard.Root.tsx"
import { ItemCardRoot } from "./itemCard.Root.tsx"
import { ItemCardSource } from "./itemCard.Source.tsx"
import { ItemCardStat } from "./itemCard.Stat.tsx"
import { ItemCardStatusIcons } from "./itemCard.StatusIcons.tsx"
import { ItemCardSubitem } from "./itemCard.Subitem.tsx"

export type { ItemCardRootProps } from "./itemCard.Root.tsx"
export type { ItemCardStatProps, ItemCardStatType } from "./itemCard.Stat.tsx"
export type { ItemCardStatusIconsProps } from "./itemCard.StatusIcons.tsx"
export type { ItemCardSubitemProps, ItemCardSubitemStat } from "./itemCard.Subitem.tsx"

export type ItemCardProps = ItemCardRootProps

interface ItemCardComponent extends FC<ItemCardProps> {
  Stat: typeof ItemCardStat
  Subitem: typeof ItemCardSubitem
  Source: typeof ItemCardSource
  DamageTrack: typeof ItemCardDamageTrack
  Footer: typeof ItemCardFooter
  StatusIcons: typeof ItemCardStatusIcons
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
ItemCard.StatusIcons = ItemCardStatusIcons
