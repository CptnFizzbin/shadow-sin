import type { FC } from "react"

import { useActiveSkillDiceGroup, useAttrDiceGroup, useWoundDiceGroup } from "#/lib/hooks/system/dicePool/useDiceGroup.ts"
import { AttributeKey } from "#/system/attributeKey.ts"
import { SkillKey } from "#/system/skills/skillKey.ts"

import { SpellCard } from "./spellCard.tsx"

export const SpellcastingDicePool: FC = () => {
  const magicGroup = useAttrDiceGroup(AttributeKey.magic)
  const spellcastingGroup = useActiveSkillDiceGroup(SkillKey.spellcasting)
  const woundGroup = useWoundDiceGroup()

  return (
    <SpellCard.DicePool
      name="Spellcasting"
      groups={[magicGroup, spellcastingGroup, woundGroup]}
    />
  )
}
