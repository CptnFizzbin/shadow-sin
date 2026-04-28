import type { FC } from "react"

import { DicePool } from "#/components/system/dicePool/dicePool.tsx"
import { useActiveSkillDiceGroup, useAttrDiceGroup, useWoundDiceGroup } from "#/components/system/dicePool/useDiceGroup.ts"
import { AttributeKey } from "#/system/attributeKey.ts"
import { SkillKey } from "#/system/skills/skillKey.ts"

interface SpellcastingDicePoolProps {
  onRoll?: (count: number) => void
}

export const SpellcastingDicePool: FC<SpellcastingDicePoolProps> = ({ onRoll }) => {
  const magicGroup = useAttrDiceGroup(AttributeKey.magic)
  const spellcastingGroup = useActiveSkillDiceGroup(SkillKey.spellcasting)
  const woundGroup = useWoundDiceGroup()

  return (
    <DicePool
      name="Spellcasting"
      groups={[magicGroup, spellcastingGroup, woundGroup]}
      onRoll={onRoll}
    />
  )
}
