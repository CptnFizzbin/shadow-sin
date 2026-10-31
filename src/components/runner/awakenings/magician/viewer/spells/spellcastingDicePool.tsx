import type { FC } from "react"

import { flattenDiceGroups } from "#/components/system/dicePool/diceGroup.tsx"
import { useActiveSkillDiceGroup, useAttrDiceGroup } from "#/hooks/system/dicePool/useDiceGroup.ts"
import { useDicePool } from "#/hooks/system/dicePool/useDicePool.ts"
import { AttributeKey } from "#/system/model/attributes/attributeKey.ts"
import { SkillKey } from "#/system/model/skills/skillKey.ts"

import { SpellCard } from "./spellCard.tsx"

export const SpellcastingDicePool: FC = () => {
  const magicGroup = useAttrDiceGroup(AttributeKey.magic)
  const spellcastingGroup = useActiveSkillDiceGroup(SkillKey.spellcasting)

  const pool = useDicePool({
    id: "magic.spellcasting",
    label: "Spellcasting",
    groups: flattenDiceGroups([magicGroup, spellcastingGroup]),
  })

  return <SpellCard.DicePool pool={pool} />
}
