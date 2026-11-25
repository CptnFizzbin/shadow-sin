import { CardElementAction } from "#/ui/cards/entityCard/elements/cardElementAction.tsx"
import { CardElementRating } from "#/ui/cards/entityCard/elements/cardElementRating.tsx"
import { CardElementStat } from "#/ui/cards/entityCard/elements/cardElementStat.tsx"
import { CardElementTitle } from "#/ui/cards/entityCard/elements/cardElementTitle.tsx"

import { CardElementEffects } from "./elements/cardElementEffects.tsx"
import { CardElementSource } from "./elements/cardElementSource.tsx"

/**
 * Pure, dependency-free EntityCard content elements, flat — for composition contexts that want
 * the elements themselves without EntityCard's own grouping. Layout regions (HeaderRow/BodyRow/
 * FooterRow) are a distinct concept, not part of this pool — see `EntityCard.Layout`.
 */
export const EntityCardElements = {
  Title: CardElementTitle,
  Rating: CardElementRating,
  Source: CardElementSource,
  Effects: CardElementEffects,
  Stat: CardElementStat,
  Action: CardElementAction,
}
