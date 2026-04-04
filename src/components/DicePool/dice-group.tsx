export interface DiceGroup {
  name: string
  size: number
  color?: string
}

export type DiceGroupList = (DiceGroup | null | boolean)[]

export function isDiceGroup(group: unknown): group is DiceGroup {
  return typeof group === "object"
    && group !== null
    && "name" in group
    && "size" in group
}
