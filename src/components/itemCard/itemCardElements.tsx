import { CardElementAvailability } from "#/components/entityCard/elements/cardElementAvailability.tsx"
import { CardElementCost } from "#/components/entityCard/elements/cardElementCost.tsx"
import { CardElementDamageTrack } from "#/components/entityCard/elements/cardElementDamageTrack.tsx"
import { CardElementQuantity } from "#/components/entityCard/elements/cardElementQuantity.tsx"
import { CardElementStatusIcon } from "#/components/entityCard/elements/cardElementStatusIcon.tsx"
import { CardElementSubType } from "#/components/entityCard/elements/cardElementSubType.tsx"
import { CardElementSubitem } from "#/components/entityCard/elements/cardElementSubitem.tsx"

/**
 * Pure, dependency-free `ItemCard`-only content elements, flat — the incremental elements
 * `ItemCard` adds on top of `EntityCardElements` (see ADR-0010). Kept separate from
 * `EntityCardElements` so composition contexts can pull just Item's own elements without also
 * pulling in the generic ones.
 */
export const ItemCardElements = {
  Availability: CardElementAvailability,
  Cost: CardElementCost,
  Quantity: CardElementQuantity,
  DamageTrack: CardElementDamageTrack,
  Subitem: CardElementSubitem,
  SubType: CardElementSubType,
  StatusIcon: CardElementStatusIcon,
}
