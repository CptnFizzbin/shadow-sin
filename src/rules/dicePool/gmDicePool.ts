import type { DiceGroup } from "#/components/system/dicePool/diceGroup.tsx"
import type { DicePoolData } from "#/components/system/dicePool/dicePoolData.tsx"
import { getPoolSize } from "#/components/system/dicePool/dicePoolData.tsx"

interface GmDicePoolOptions {
  id: string
  label: string
  groups: DiceGroup[]
  /** Wound modifier as a positive number of dice to subtract. */
  woundMod?: number
}

/**
 * Compiles a dice pool from hand-entered dice groups, for GM tools that have no Runner to derive
 * one from. Zero-sized groups are dropped so the ledger only lists what actually contributes.
 */
export const buildGmDicePool = ({ id, label, groups, woundMod = 0 }: GmDicePoolOptions): DicePoolData => {
  const woundGroup: DiceGroup = { id: "wounds", name: "Wounds", size: -woundMod, type: "penalty" }
  const allGroups = [...groups, woundGroup].filter((group) => group.size !== 0)

  return { id, label, groups: allGroups, size: getPoolSize(allGroups) }
}
