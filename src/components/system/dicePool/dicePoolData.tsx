import type { DiceGroupList } from "./diceGroup.tsx"
import { isDiceGroup } from "./diceGroup.tsx"

export interface DicePoolData {
  id: string
  name: string
  groups: DiceGroupList
  size: number
}

export const createDicePool = (id: string, name: string, groups: DiceGroupList): DicePoolData => {
  return { id, name, groups, size: getPoolSize(groups) }
}

export const getPoolSize = (groups: DiceGroupList): number => {
  const diceGroups = groups.filter(isDiceGroup)

  return Math.max(
    1,
    diceGroups.reduce((sum, group) => sum + Number(group.size), 0),
  )
}
