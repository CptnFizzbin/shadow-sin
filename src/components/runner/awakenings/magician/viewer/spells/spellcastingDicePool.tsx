import type { FC } from "react"

import { flattenDiceGroups } from "#/components/system/dicePool/diceGroup.tsx"
import { createDicePool } from "#/components/system/dicePool/dicePoolData.tsx"
import { useActiveSkillDiceGroup, useAttrDiceGroup, useWoundDiceGroup } from "#/hooks/system/dicePool/useDiceGroup.ts"
import { AttributeKey } from "#/system/model/attributes/attributeKey.ts"
import { SkillKey } from "#/system/model/skills/skillKey.ts"

import { SpellCard } from "./spellCard.tsx"

export const SpellcastingDicePool: FC = () => {
  const magicGroup = useAttrDiceGroup(AttributeKey.magic)
  const spellcastingGroup = useActiveSkillDiceGroup(SkillKey.spellcasting)
  const woundGroup = useWoundDiceGroup()

  const pool = createDicePool({
    id: "magic.spellcasting",
    label: "Spellcasting",
    groups: flattenDiceGroups([magicGroup, spellcastingGroup, woundGroup]),
  })

  return <SpellCard.DicePool pool={pool} />
}
