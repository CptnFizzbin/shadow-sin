import { CardElementAvailability } from "#/components/ui/cards/entityCard/elements/cardElementAvailability.tsx"
import { CardElementCost } from "#/components/ui/cards/entityCard/elements/cardElementCost.tsx"
import { CardElementDamageTrack } from "#/components/ui/cards/entityCard/elements/cardElementDamageTrack.tsx"
import { CardElementQuantity } from "#/components/ui/cards/entityCard/elements/cardElementQuantity.tsx"
import { CardElementStatusIcon } from "#/components/ui/cards/entityCard/elements/cardElementStatusIcon.tsx"
import { CardElementSubType } from "#/components/ui/cards/entityCard/elements/cardElementSubType.tsx"
import { CardElementSubitem } from "#/components/ui/cards/entityCard/elements/cardElementSubitem.tsx"
import { EntityCardElements } from "#/components/ui/cards/entityCard/entityCardElements.tsx"

/**
 * Pure, dependency-free ItemCard content elements, flat — `EntityCard`'s content elements pulled
 * in by name (not a blind spread of `EntityCardElements`, so it's explicit which ones `ItemCard`
 * actually reuses) plus Item's own incremental elements. `Layout` regions live separately —
 * `ItemCard` (in `itemCard.tsx`) re-exports `EntityCard.Layout` directly onto itself rather than
 * folding it in here, since `Layout` isn't a content element.
 */
export const ItemCardElements = {
  Title: EntityCardElements.Title,
  Rating: EntityCardElements.Rating,
  Source: EntityCardElements.Source,
  Effects: EntityCardElements.Effects,
  Stat: EntityCardElements.Stat,
  Action: EntityCardElements.Action,
  Availability: CardElementAvailability,
  Cost: CardElementCost,
  Quantity: CardElementQuantity,
  DamageTrack: CardElementDamageTrack,
  Subitem: CardElementSubitem,
  SubType: CardElementSubType,
  StatusIcon: CardElementStatusIcon,
}
