import type { DiceGroup, DiceGroupList } from "./diceGroup.tsx"
import { isDiceGroup } from "./diceGroup.tsx"

/** Describes a dice pool for a selector built with `createDicePoolSelector` to compile. */
export interface DicePoolConfig {
  id: string
  label: string
  /** When `true`, the pool gets no Wound group even if the Runner is wounded. */
  excludeWoundMod?: boolean
  groups: DiceGroup[]
}

/** A compiled dice pool, ready for `DicePool` to display. */
export interface DicePoolData extends DicePoolConfig {
  size: number
}

/** Total dice in `groups`, never fewer than one. */
export const getPoolSize = (groups: DiceGroupList): number => {
  const diceGroups = groups.filter(isDiceGroup)

  return Math.max(
    1,
    diceGroups.reduce((sum, group) => sum + Number(group.size), 0),
  )
}
