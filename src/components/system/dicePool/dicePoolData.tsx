import type { DiceGroup, DiceGroupList } from "./diceGroup.tsx"
import { isDiceGroup } from "./diceGroup.tsx"

/** Describes a dice pool to build with `createDicePool`. */
export interface DicePoolConfig {
  id: string
  label: string
  /** When `true`, the Runner's wound modifier is not applied when the pool is rendered. */
  excludeWoundMod?: boolean
  groups: DiceGroup[]
}

export interface DicePoolData extends DicePoolConfig {
  size: number
}

export const createDicePool = (config: DicePoolConfig): DicePoolData => {
  return { ...config, size: getPoolSize(config.groups) }
}

export const getPoolSize = (groups: DiceGroupList): number => {
  const diceGroups = groups.filter(isDiceGroup)

  return Math.max(
    1,
    diceGroups.reduce((sum, group) => sum + Number(group.size), 0),
  )
}
