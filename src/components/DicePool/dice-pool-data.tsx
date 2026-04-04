import type { DiceGroupList } from "#/components/DicePool/dice-group.tsx"
import { isDiceGroup } from "#/components/DicePool/dice-group.tsx"

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
    0,
    diceGroups.reduce((sum, group) => sum + group.size, 0),
  )
}
