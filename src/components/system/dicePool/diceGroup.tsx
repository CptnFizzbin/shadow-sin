export type DiceGroupType = "attribute" | "skill" | "bonus" | "defaulting" | "penalty"

export interface DiceGroup {
  id?: string
  name: string
  size: number
  type?: DiceGroupType
  /** Explicit color override. Prefer `type` where the group fits one of the standard categories. */
  color?: string
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
 * any nesting depth. `DiceGroupList` nests arbitrarily (callers assemble it from other
 * `DicePoolData`'s own `.groups`), so a fixed-depth `Array.flat()` isn't enough in general.
 */
export function flattenDiceGroups(list: DiceGroupList): DiceGroup[] {
  // `list.flat(Infinity)` directly hits TS2589 ("Type instantiation is excessively deep") —
  // DiceGroupList's self-referential type makes flat()'s depth-tracking generic recurse forever.
  // Flattening through `unknown[]` keeps the same runtime behavior without that.
  return (list as unknown[]).flat(Infinity).filter(isDiceGroup)
}
