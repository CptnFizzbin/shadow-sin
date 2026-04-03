import type { FC } from "react"

import { DicePool } from "#/components/DicePool/dice-pool.tsx"
import {
  useDiceSkillGroup,
  useWoundDiceGroup,
} from "#/components/DicePool/use-dice-group.ts"
import { SkillKey } from "#/lib/system/skill-key.ts"

export const SpellcastingDicePool: FC = () => {
  const spellcastingGroup = useDiceSkillGroup(SkillKey.spellcasting)
  const woundGroup = useWoundDiceGroup()

  return (
    <DicePool
      name="Spellcasting"
      groups={[spellcastingGroup, woundGroup]}
    />
  )
}
