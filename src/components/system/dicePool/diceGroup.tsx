import type { RatingBreakdown } from "#/system/formulas/ratings/ratingFormulas.ts"

export type DiceGroupType = "attribute" | "skill" | "bonus" | "defaulting" | "penalty"

export interface DiceGroup {
  id?: string
  name: string
  size: number
  /**
   * How a Rating-sized group's `size` was reached — its Raw Value and Modifiers — for display only.
   * `size` is already the Rating, so nothing here is added to the pool again.
   */
  breakdown?: RatingBreakdown
  type?: DiceGroupType
  /** Explicit color override. Prefer `type` where the group fits one of the standard categories. */
  color?: string
}

/** A group sized by `breakdown`'s Rating, carrying the breakdown when Modifiers changed the Raw Value. */
export function ratingDiceGroup(group: Omit<DiceGroup, "size" | "breakdown">, breakdown: RatingBreakdown): DiceGroup {
  return breakdown.modifiers.length === 0
    ? { ...group, size: breakdown.rating }
    : { ...group, size: breakdown.rating, breakdown }
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
