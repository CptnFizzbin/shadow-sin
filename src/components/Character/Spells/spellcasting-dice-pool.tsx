import type { FC } from "react"

import { DicePool } from "#/components/DicePool/dice-pool.tsx"
import {
  useActiveSkillDiceGroup,
  useAttrDiceGroup,
  useWoundDiceGroup,
} from "#/components/DicePool/use-dice-group.ts"
import { AttributeKey } from "#/lib/system/attribute-key.ts"
import { SkillKey } from "#/lib/system/skill-key.ts"

export const SpellcastingDicePool: FC = () => {
  const magicGroup = useAttrDiceGroup(AttributeKey.magic)
  const spellcastingGroup = useActiveSkillDiceGroup(SkillKey.spellcasting)
  const woundGroup = useWoundDiceGroup()

  return (
    <DicePool
      name="Spellcasting"
      groups={[magicGroup, spellcastingGroup, woundGroup]}
    />
  )
}
