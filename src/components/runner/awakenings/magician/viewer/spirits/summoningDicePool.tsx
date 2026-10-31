import type { FC } from "react"

import { DicePool } from "#/components/system/dicePool/dicePool.tsx"
import { MagicPoolSelectors } from "#/state/runner/dicePool/magicPools.selector.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"
import type { SpiritType } from "#/system/model/magic/spiritData.ts"
import { SkillKey } from "#/system/model/skills/skillKey.ts"

interface SummoningDicePoolProps {
  spiritType: SpiritType
  isBound: boolean
}

export const SummoningDicePool: FC<SummoningDicePoolProps> = ({ spiritType, isBound }) => {
  const pool = useRunnerSelector(MagicPoolSelectors.selectSummoningTest, {
    skill: isBound ? SkillKey.binding : SkillKey.summoning,
    spiritType,
  })

  return <DicePool pool={pool} />
}
