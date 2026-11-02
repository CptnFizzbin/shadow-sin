import type { RatingBreakdown, RatingModifier } from "#/system/formulas/ratings/ratingFormulas.ts"

export type DiceGroupType = "attribute" | "skill" | "bonus" | "defaulting" | "penalty"

export interface DiceGroup {
  id?: string
  name: string
  size: number
  /**
   * What `size` is made of, for display only — `size` already includes every modifier, so a dice
   * pool never adds these again.
   */
  modifiers?: RatingModifier[]
  type?: DiceGroupType
  /** Explicit color override. Prefer `type` where the group fits one of the standard categories. */
  color?: string
}

/** A group sized by `breakdown`'s Rating, listing its Modifiers when it has any. */
export function ratingDiceGroup(
  group: Omit<DiceGroup, "size" | "modifiers">,
  { rating, modifiers }: RatingBreakdown,
): DiceGroup {
  return modifiers.length === 0 ? { ...group, size: rating } : { ...group, size: rating, modifiers }
}

export type DiceGroupList = (DiceGroupList | DiceGroup | null | boolean)[]

export function isDiceGroup(group: unknown): group is DiceGroup {
  return typeof group === "object"
    && group !== null
    && "name" in group
    && "size" in group
}

/**
 * Flattens a `DiceGroupList` to its `DiceGroup` entries, discarding `null`/`boolean` filler at
 * any nesting depth.
 */
export function flattenDiceGroups(list: DiceGroupList): DiceGroup[] {
  // `list.flat(Infinity)` directly hits TS2589 ("Type instantiation is excessively deep") —
  // DiceGroupList's self-referential type makes flat()'s depth-tracking generic recurse forever.
  // Flattening through `unknown[]` keeps the same runtime behavior without that.
  return (list as unknown[]).flat(Infinity).filter(isDiceGroup)
}
