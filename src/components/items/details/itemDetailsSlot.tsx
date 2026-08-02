import { SlotsProvider } from "#/lib/slotUtils.ts"

import { ItemDetailsAvailability } from "./itemDetails.Availability.tsx"
import { ItemDetailsContent } from "./itemDetails.Content.tsx"
import { ItemDetailsCost } from "./itemDetails.Cost.tsx"
import { ItemDetailsDamageTrack } from "./itemDetails.DamageTrack.tsx"
import { ItemDetailsFooter } from "./itemDetails.Footer.tsx"
import { ItemDetailsQuantity } from "./itemDetails.Quantity.tsx"
import { ItemDetailsQuickAction } from "./itemDetails.QuickAction.tsx"
import { ItemDetailsRating } from "./itemDetails.Rating.tsx"
import { ItemDetailsSource } from "./itemDetails.Source.tsx"
import { ItemDetailsStat } from "./itemDetails.Stat.tsx"
import { ItemDetailsSubitem } from "./itemDetails.Subitem.tsx"
import { ItemDetailsTitle } from "./itemDetails.Title.tsx"
import { ItemDetailsType } from "./itemDetails.Type.tsx"
import { ItemDetailsStatus } from "./itemDetailsStatus.tsx"

export type { ItemDetailsAvailabilityProps } from "./itemDetails.Availability.tsx"
export type { ItemDetailsContentProps } from "./itemDetails.Content.tsx"
export type { ItemDetailsCostProps } from "./itemDetails.Cost.tsx"
export type { ItemDetailsQuantityProps } from "./itemDetails.Quantity.tsx"
export type { ItemDetailsQuickActionProps } from "./itemDetails.QuickAction.tsx"
export type { ItemDetailsRatingProps } from "./itemDetails.Rating.tsx"
export type { ItemDetailsSourceProps } from "./itemDetails.Source.tsx"
export type { ItemDetailsStatProps, ItemDetailsStatType } from "./itemDetails.Stat.tsx"
export type { ItemDetailsStatusIconsProps } from "./itemDetailsStatus.tsx"
export type { ItemDetailsSubitemProps } from "./itemDetails.Subitem.tsx"
export type { ItemDetailsTitleProps } from "./itemDetails.Title.tsx"
export type { ItemDetailsTypeProps } from "./itemDetails.Type.tsx"

/**
 * Slot components for composing an ItemDetails body (ItemDetailsRoot or a
 * typed details view wrapping it). Parallel to `ItemCardSlot`, but not built
 * on top of it — card slots are condensed for space, ItemDetails slots
 * render the same concepts at full fidelity (see ADR-0009). Kept separate
 * from the `ItemDetails` dispatcher so typed details views can depend on
 * slots without depending on `ItemDetails` itself, which would otherwise
 * import every typed details view and create a cycle.
 *
 * `ItemDetailsRoot` renders `Title`/`Type`/`Source`/`Availability`/
 * `Quantity`/`Cost` directly from the common `ItemData` fields (and the
 * `type` prop) by default, since every item carries them — these slots exist
 * only so a typed view can override that default rendering when it needs
 * to. `Rating` and `Content` have no such default; they're purely additive,
 * like `Stat`/`Subitem`/`DamageTrack`/`Footer`/`QuickAction`.
 */
export const ItemDetailsSlot = {
  Title: ItemDetailsTitle,
  Type: ItemDetailsType,
  Source: ItemDetailsSource,
  Availability: ItemDetailsAvailability,
  Quantity: ItemDetailsQuantity,
  Cost: ItemDetailsCost,
  Rating: ItemDetailsRating,
  Stat: ItemDetailsStat,
  Subitem: ItemDetailsSubitem,
  DamageTrack: ItemDetailsDamageTrack,
  Footer: ItemDetailsFooter,
  Content: ItemDetailsContent,
  Status: ItemDetailsStatus,
  QuickAction: ItemDetailsQuickAction,
}

export class ItemDetailsSlotsProvider extends SlotsProvider {
  get title() {
    return this.find(ItemDetailsTitle)
  }

  get type() {
    return this.find(ItemDetailsType)
  }

  get source() {
    return this.find(ItemDetailsSource)
  }

  get availability() {
    return this.find(ItemDetailsAvailability)
  }

  get quantity() {
    return this.find(ItemDetailsQuantity)
  }

  get cost() {
    return this.find(ItemDetailsCost)
  }

  get rating() {
    return this.find(ItemDetailsRating)
  }

  get statuses() {
    return this.filter(ItemDetailsStatus)
  }

  get stats() {
    return this.filter(ItemDetailsStat)
  }

  get subitems() {
    return this.filter(ItemDetailsSubitem)
  }

  get damageTracks() {
    return this.filter(ItemDetailsDamageTrack)
  }

  get footer() {
    return this.find(ItemDetailsFooter)
  }

  get content() {
    return this.find(ItemDetailsContent)
  }

  get quickActions() {
    return this.filter(ItemDetailsQuickAction)
  }
}
