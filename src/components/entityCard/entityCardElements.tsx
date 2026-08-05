import { CardElementAction } from "./elements/cardElementAction.tsx"
import { CardElementEffect } from "./elements/cardElementEffect.tsx"
import { CardElementRating } from "./elements/cardElementRating.tsx"
import { CardElementSource } from "./elements/cardElementSource.tsx"
import { CardElementStat } from "./elements/cardElementStat.tsx"
import { CardElementTitle } from "./elements/cardElementTitle.tsx"

/**
 * Pure, dependency-free EntityCard content elements, flat — for composition contexts that want
 * the elements themselves without EntityCard's own grouping. Layout regions (HeaderRow/BodyRow/
 * FooterRow) are a distinct concept, not part of this pool — see `EntityCard.Layout`.
 */
export const EntityCardElements = {
  Title: CardElementTitle,
  Rating: CardElementRating,
  Source: CardElementSource,
  Effect: CardElementEffect,
  Stat: CardElementStat,
  Action: CardElementAction,
}
