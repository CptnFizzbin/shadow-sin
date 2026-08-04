import { CardElementAction } from "./elements/cardElementAction.tsx"
import { CardElementBody } from "./elements/cardElementBody.tsx"
import { CardElementEffects } from "./elements/cardElementEffects.tsx"
import { CardElementFooter } from "./elements/cardElementFooter.tsx"
import { CardElementHeader } from "./elements/cardElementHeader.tsx"
import { CardElementRating } from "./elements/cardElementRating.tsx"
import { CardElementSource } from "./elements/cardElementSource.tsx"
import { CardElementStat } from "./elements/cardElementStat.tsx"
import { CardElementTitle } from "./elements/cardElementTitle.tsx"

export type { CardElementActionProps } from "./elements/cardElementAction.tsx"
export type { CardElementBodyProps } from "./elements/cardElementBody.tsx"
export type { CardElementEffectsProps } from "./elements/cardElementEffects.tsx"
export type { CardElementFooterProps } from "./elements/cardElementFooter.tsx"
export type { CardElementHeaderProps } from "./elements/cardElementHeader.tsx"
export type { CardElementRatingProps } from "./elements/cardElementRating.tsx"
export type { CardElementSourceProps } from "./elements/cardElementSource.tsx"
export type { CardElementStatProps, CardElementStatType } from "./elements/cardElementStat.tsx"
export type { CardElementTitleProps } from "./elements/cardElementTitle.tsx"

/**
 * Pure, dependency-free EntityCard building blocks, flat — no `Layout`/element split — for
 * composition contexts that want the elements themselves without EntityCard's own grouping.
 */
export const EntityCardElements = {
  Header: CardElementHeader,
  Body: CardElementBody,
  Footer: CardElementFooter,
  Title: CardElementTitle,
  Rating: CardElementRating,
  Source: CardElementSource,
  Effects: CardElementEffects,
  Stat: CardElementStat,
  Action: CardElementAction,
}

/**
 * EntityCard's own structural regions, kept under `.Layout` so they read distinctly from the
 * content elements below (`EntityCard.Layout.Header` vs. `EntityCard.Title`) — every category
 * tier (`ItemCard`, `SpiritCard`, ...) assembles these regions plus its own incremental elements.
 */
const EntityCardLayout = {
  Header: CardElementHeader,
  Body: CardElementBody,
  Footer: CardElementFooter,
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
