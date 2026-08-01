import { ItemDetailsDamageTrack } from "./itemDetails.DamageTrack.tsx"
import { ItemDetailsFooter } from "./itemDetails.Footer.tsx"
import { ItemDetailsQuickAction } from "./itemDetails.QuickAction.tsx"
import { ItemDetailsStat } from "./itemDetails.Stat.tsx"
import { ItemDetailsStatusIcons } from "./itemDetails.StatusIcons.tsx"
import { ItemDetailsSubitem } from "./itemDetails.Subitem.tsx"

export type { ItemDetailsQuickActionProps } from "./itemDetails.QuickAction.tsx"
export type { ItemDetailsStatProps, ItemDetailsStatType } from "./itemDetails.Stat.tsx"
export type { ItemDetailsStatusIconsProps } from "./itemDetails.StatusIcons.tsx"
export type { ItemDetailsSubitemProps } from "./itemDetails.Subitem.tsx"

/**
 * Slot components for composing an ItemDetails body (BasicItemDetails or a
 * typed details view wrapping it). Parallel to `ItemCardSlot`, but not built
 * on top of it — card slots are condensed for space, ItemDetails slots
 * render the same concepts at full fidelity (see ADR-0009). Kept separate
 * from the `ItemDetails` dispatcher so typed details views can depend on
 * slots without depending on `ItemDetails` itself, which would otherwise
 * import every typed details view and create a cycle.
 *
 * `Source`/description/notes/cost/quantity/availability/effects/status
 * aren't here: `BasicItemDetails` renders them directly from the common
 * `ItemData` fields, since every item carries them, so they're not
 * composable slots.
 */
export const ItemDetailsSlot = {
  Stat: ItemDetailsStat,
  Subitem: ItemDetailsSubitem,
  DamageTrack: ItemDetailsDamageTrack,
  Footer: ItemDetailsFooter,
  StatusIcons: ItemDetailsStatusIcons,
  QuickAction: ItemDetailsQuickAction,
}
