import type { FC } from "react"

import { CardElementAmmo } from "#/components/entityCard/elements/cardElementAmmo.tsx"
import { CardElementDicePool } from "#/components/entityCard/elements/cardElementDicePool.tsx"
import { EntityCard } from "#/components/entityCard/entityCard.tsx"
import type { ItemCardProps } from "#/components/itemCard/itemCard.tsx"
import { ItemCard } from "#/components/itemCard/itemCard.tsx"
import { ItemCardElements } from "#/components/itemCard/itemCardElements.tsx"

/**
 * Concrete typed-card tier from ADR-0010, sitting directly on `ItemCard` — Weapon has no further
 * subtype split the way it would need its own category tier, but it does need two elements no
 * other Item subtype uses: `.Ammo` (a Firearm's remaining/size) and `.DicePool` (the attack pool,
 * shared with `WeaponAttackPanel` outside any card — see `SpellCard.DicePool` for the same
 * pattern). `ItemCardElements` are re-exposed by name so call sites only need this one import.
 */
const WeaponCardRoot: FC<ItemCardProps> = (props) => <ItemCard {...props} />

WeaponCardRoot.displayName = "WeaponCard"

export const WeaponCard = Object.assign(
  WeaponCardRoot,
  ItemCardElements,
  {
    Ammo: CardElementAmmo,
    DicePool: CardElementDicePool,
    Layout: EntityCard.Layout,
  },
)
