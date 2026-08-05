import { SlotManager } from "#/lib/slotUtils.ts"

import { DataCardSlotAvailability } from "./dataCardSlot.Availability.tsx"
import { DataCardSlotContent } from "./dataCardSlot.Content.tsx"
import { DataCardSlotContextAction } from "./dataCardSlot.ContextAction.tsx"
import { DataCardSlotCost } from "./dataCardSlot.Cost.tsx"
import { DataCardSlotDamageTrack } from "./dataCardSlot.DamageTrack.tsx"
import { DataCardSlotFooter } from "./dataCardSlot.Footer.tsx"
import { DataCardSlotQuantity } from "./dataCardSlot.Quantity.tsx"
import { DataCardSlotRating } from "./dataCardSlot.Rating.tsx"
import { DataCardSlotSource } from "./dataCardSlot.Source.tsx"
import { DataCardSlotStat } from "./dataCardSlot.Stat.tsx"
import { DataCardSlotStatusIcon } from "./dataCardSlot.StatusIcon.tsx"
import { DataCardSlotSubitem } from "./dataCardSlot.Subitem.tsx"
import { DataCardSlotTitle } from "./dataCardSlot.Title.tsx"
import { DataCardSlotType } from "./dataCardSlot.Type.tsx"

export type { DataCardAvailabilityProps } from "./dataCardSlot.Availability.tsx"
export type { DataCardContentProps } from "./dataCardSlot.Content.tsx"
export type { DataCardQuickActionProps } from "./dataCardSlot.ContextAction.tsx"
export type { DataCardCostProps } from "./dataCardSlot.Cost.tsx"
export type { DataCardQuantityProps } from "./dataCardSlot.Quantity.tsx"
export type { DataCardRatingProps } from "./dataCardSlot.Rating.tsx"
export type { DataCardStatProps, DataCardStatType } from "./dataCardSlot.Stat.tsx"
export type { DataCardStatusIconProps } from "./dataCardSlot.StatusIcon.tsx"
export type { DataCardSubitemProps, DataCardSubitemStat } from "./dataCardSlot.Subitem.tsx"
export type { DataCardTitleProps } from "./dataCardSlot.Title.tsx"
export type { DataCardTypeProps } from "./dataCardSlot.Type.tsx"

/**
 * Slot components composing a DataCard's body, attached onto the `DataCard`
 * export itself (`DataCard.Title`, `DataCard.Stat`, ...) rather than kept as
 * a separate namespace. DataCard itself carries no domain knowledge — typed
 * wrappers (e.g. `ItemDataCardRoot` for `ItemData`, or a domain's own
 * `*DataCard`) decide which slots to populate from their own data.
 */
export const DataCardSlot = {
  Title: DataCardSlotTitle,
  Type: DataCardSlotType,
  Source: DataCardSlotSource,
  Availability: DataCardSlotAvailability,
  Quantity: DataCardSlotQuantity,
  Cost: DataCardSlotCost,
  Rating: DataCardSlotRating,
  StatusIcon: DataCardSlotStatusIcon,
  Stat: DataCardSlotStat,
  Subitem: DataCardSlotSubitem,
  DamageTrack: DataCardSlotDamageTrack,
  Footer: DataCardSlotFooter,
  Content: DataCardSlotContent,
  QuickAction: DataCardSlotContextAction,
}

export class DataCardSlotManager extends SlotManager {
  get title() {
    return this.find(DataCardSlotTitle)
  }

  get type() {
    return this.find(DataCardSlotType)
  }

  get source() {
    return this.find(DataCardSlotSource)
  }

  get availability() {
    return this.find(DataCardSlotAvailability)
  }

  get quantity() {
    return this.find(DataCardSlotQuantity)
  }

  get cost() {
    return this.find(DataCardSlotCost)
  }

  get rating() {
    return this.find(DataCardSlotRating)
  }

  get statusIcons() {
    return this.filter(DataCardSlotStatusIcon)
  }

  get stats() {
    return this.filter(DataCardSlotStat)
  }

  get subitems() {
    return this.filter(DataCardSlotSubitem)
  }

  get damageTrack() {
    return this.find(DataCardSlotDamageTrack)
  }

  get footer() {
    return this.find(DataCardSlotFooter)
  }

  get content() {
    return this.find(DataCardSlotContent)
  }

  get quickActions() {
    return this.filter(DataCardSlotContextAction)
  }

  get hasStatRow(): boolean {
    return !!(
      this.stats.length > 0
      || this.rating
      || this.quantity
    )
  }

  get hasBody(): boolean {
    return !!(
      this.hasStatRow
      || this.damageTrack
      || this.subitems.length > 0
    )
  }

  get hasFooterBand(): boolean {
    return !!(
      this.source
      || this.availability
      || this.cost
      || this.footer
    )
  }
}
