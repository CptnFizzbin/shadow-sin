import { createContext, useContext } from "react"

import type { ItemData } from "#data/items/itemData.ts"
import { isItemActive } from "#rules/items/itemStateRules.ts"

/** Narrows the top-level Items a gear list shows, e.g. to the Gear page's current tab and search. */
export interface GearListFilter {
  includes: (item: ItemData) => boolean
}

/** The nearest gear list filter; lists outside one show every Item. */
export const GearListFilterContext = createContext<GearListFilter | null>(null)

/** Orders Items with Equipped or Implanted ones first, keeping the original order otherwise. */
export function sortEquippedFirst<TItem extends ItemData>(items: TItem[]): TItem[] {
  return [...items].sort((left, right) => Number(isItemActive(right)) - Number(isItemActive(left)))
}

/**
 * Returns a function that narrows a gear list's top-level Items by the nearest
 * `GearListFilterContext` and orders them Equipped first.
 */
export function useGearListView() {
  const filter = useContext(GearListFilterContext)

  return <TItem extends ItemData>(items: TItem[]): TItem[] =>
    sortEquippedFirst(filter ? items.filter(filter.includes) : items)
}
