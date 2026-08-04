import { CardElementAction } from "./elements/cardElementAction.tsx"
import { CardElementEffects } from "./elements/cardElementEffects.tsx"
import { CardElementRating } from "./elements/cardElementRating.tsx"
import { CardElementSource } from "./elements/cardElementSource.tsx"
import { CardElementStat } from "./elements/cardElementStat.tsx"
import { CardElementTitle } from "./elements/cardElementTitle.tsx"
import { EntityCardLayoutBody } from "./layout/entityCardLayoutBody.tsx"
import { EntityCardLayoutFooter } from "./layout/entityCardLayoutFooter.tsx"
import { EntityCardLayoutHeader } from "./layout/entityCardLayoutHeader.tsx"

export type { CardElementActionProps } from "./elements/cardElementAction.tsx"
export type { CardElementEffectsProps } from "./elements/cardElementEffects.tsx"
export type { CardElementRatingProps } from "./elements/cardElementRating.tsx"
export type { CardElementSourceProps } from "./elements/cardElementSource.tsx"
export type { CardElementStatProps, CardElementStatType } from "./elements/cardElementStat.tsx"
export type { CardElementTitleProps } from "./elements/cardElementTitle.tsx"
export type { EntityCardLayoutBodyProps } from "./layout/entityCardLayoutBody.tsx"
export type { EntityCardLayoutFooterProps } from "./layout/entityCardLayoutFooter.tsx"
export type { EntityCardLayoutHeaderProps } from "./layout/entityCardLayoutHeader.tsx"

/**
 * Pure, dependency-free EntityCard content elements, flat — for composition contexts that want
 * the elements themselves without EntityCard's own grouping. Layout regions (Header/Body/Footer)
 * are a distinct concept, not part of this pool — see `EntityCard.Layout`.
 */
export const EntityCardElements = {
  Title: CardElementTitle,
  Rating: CardElementRating,
  Source: CardElementSource,
  Effects: CardElementEffects,
  Stat: CardElementStat,
  Action: CardElementAction,
}

/**
 * EntityCard's structural regions, kept under `.Layout` so they read distinctly from the content
 * elements below (`EntityCard.Layout.Header` vs. `EntityCard.Title`) — every category tier
 * (`ItemCard`, `SpiritCard`, ...) assembles these regions plus its own incremental elements.
 */
const EntityCardLayout = {
  Header: EntityCardLayoutHeader,
  Body: EntityCardLayoutBody,
  Footer: EntityCardLayoutFooter,
}

/**
 * Top compound-component tier from ADR-0010, replacing `DataCard`. Category tiers
 * (`ItemCard`, `SpiritCard`, `SpellCard`, `PowerCard`, ...) assemble these elements plus their
 * own via `Object.assign`, reusing rather than duplicating them.
 */
export const EntityCard = {
  Layout: EntityCardLayout,
  Title: CardElementTitle,
  Rating: CardElementRating,
  Source: CardElementSource,
  Effects: CardElementEffects,
  Stat: CardElementStat,
  Action: CardElementAction,
}
