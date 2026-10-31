import type { DiceGroup, DiceGroupList } from "./diceGroup.tsx"
import { isDiceGroup } from "./diceGroup.tsx"

/** Describes a dice pool to build with `createDicePool`. */
export interface DicePoolConfig {
  id: string
  label: string
  /** When `true`, the pool gets no Wound group even if the Runner is wounded. */
  excludeWoundMod?: boolean
  groups: DiceGroup[]
}

export interface DicePoolData extends DicePoolConfig {
  size: number
}

/**
 * Builds a dice pool from `config`, appending a Wound penalty group for `woundMod` (the Runner's
 * current wound modifier, as a positive number of dice lost) unless `config.excludeWoundMod` is set.
 * Components should prefer `useDicePool`, which supplies the Runner's wound modifier.
 */
export const createDicePool = (config: DicePoolConfig, woundMod: number): DicePoolData => {
  const groups = config.excludeWoundMod || woundMod === 0
    ? config.groups
    : [...config.groups, { name: "Wound", size: -woundMod, type: "penalty" } satisfies DiceGroup]

  return { ...config, groups, size: getPoolSize(groups) }
}

const getPoolSize = (groups: DiceGroupList): number => {
  const diceGroups = groups.filter(isDiceGroup)

  return Math.max(
    1,
    diceGroups.reduce((sum, group) => sum + Number(group.size), 0),
  )
}
