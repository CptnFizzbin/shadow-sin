import { CardElementAction } from "#/components/cards/entityCard/elements/cardElementAction.tsx"
import { CardElementEffects } from "#/components/cards/entityCard/elements/cardElementEffects.tsx"
import { CardElementRating } from "#/components/cards/entityCard/elements/cardElementRating.tsx"
import { CardElementSource } from "#/components/cards/entityCard/elements/cardElementSource.tsx"
import { CardElementStat } from "#/components/cards/entityCard/elements/cardElementStat.tsx"
import { CardElementTitle } from "#/components/cards/entityCard/elements/cardElementTitle.tsx"

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
