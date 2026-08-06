import { CardElementAvailability } from "#/components/entityCard/elements/cardElementAvailability.tsx"
import { CardElementCost } from "#/components/entityCard/elements/cardElementCost.tsx"
import { CardElementDamageTrack } from "#/components/entityCard/elements/cardElementDamageTrack.tsx"
import { CardElementQuantity } from "#/components/entityCard/elements/cardElementQuantity.tsx"
import { CardElementStatusIcon } from "#/components/entityCard/elements/cardElementStatusIcon.tsx"
import { CardElementSubType } from "#/components/entityCard/elements/cardElementSubType.tsx"
import { CardElementSubitem } from "#/components/entityCard/elements/cardElementSubitem.tsx"
import { EntityCardElements } from "#/components/entityCard/entityCardElements.tsx"

/**
 * Pure, dependency-free ItemCard content elements, flat — `EntityCard`'s content elements pulled
 * in by name (not a blind spread of `EntityCardElements`, so it's explicit which ones `ItemCard`
 * actually reuses) plus Item's own incremental elements. `Layout` regions are deliberately
 * excluded — those stay on `EntityCard.Layout` directly; `ItemCard` doesn't re-expose them (see
 * `ItemCardRoot`, which uses them internally to lay out Item's own common fields).
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
