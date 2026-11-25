import type { FC } from "react"

import { DicePool } from "#app/components/system/dicePool/dicePool.tsx"
import type { SpiritType } from "#data/magic/spiritData.ts"
import { SkillKey } from "#data/skills/skillKey.ts"
import { MagicPoolSelectors } from "#state/runner/dicePool/magicPools.selector.ts"
import { useRunnerSelector } from "#state/runner/runnerStore.selectors.ts"

interface SummoningDicePoolProps {
  spiritType: SpiritType
  isBound: boolean
}

export const SummoningDicePool: FC<SummoningDicePoolProps> = ({ spiritType, isBound }) => {
  const pool = useRunnerSelector(MagicPoolSelectors.selectSummoningTest, {
    skill: isBound ? SkillKey.binding : SkillKey.summoning,
    spiritType,
  })

  return <DicePool pool={{ ...pool, label: isBound ? "Binding" : "Summoning" }} />
}
