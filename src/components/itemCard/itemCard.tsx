import { EntityCardElements } from "#/components/entityCard/entityCardElements.tsx"
import { EntityCardLayout } from "#/components/entityCard/entityCardLayout.tsx"

import { ItemCardElements } from "./itemCardElements.tsx"

/**
 * Category tier from ADR-0010, sitting between `EntityCard` (universal) and a concrete typed
 * card (`WeaponCard`, `ArmorCard`, ...). Assembles `EntityCard`'s content elements and `Layout`
 * regions plus Item's own incremental elements (`ItemCardElements`) under one dot-notation
 * namespace — `ItemCard.Title`, `ItemCard.Cost`, `ItemCard.Layout.BodyRow`, etc. — the same way
 * `EntityCard` assembles `EntityCardElements` onto itself. No `ItemCardRoot` yet: typed cards
 * still render via `DataCard`/`ItemDataCardRoot` until they migrate (#448–450).
 */
export const ItemCard = Object.assign(
  {},
  EntityCardElements,
  ItemCardElements,
  { Layout: EntityCardLayout },
)
