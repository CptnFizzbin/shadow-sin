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
