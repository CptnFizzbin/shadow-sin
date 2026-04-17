import type { FC } from "react"

import { useActiveSkillRating } from "#/components/character/characterUtils.ts"
import { DicePool } from "#/components/dicePool/dicePool.tsx"
import { useAttrDiceGroup, useWoundDiceGroup } from "#/components/dicePool/useDiceGroup.ts"
import { AttributeKey } from "#/lib/system/attributeKey.ts"
import type { WeaponData } from "#/lib/system/gear/weaponData.ts"

interface AttackDicePoolProps {
  weapon: WeaponData
}

export const AttackDicePool: FC<AttackDicePoolProps> = ({ weapon }) => {
  const attrKey = weapon.attribute ?? AttributeKey.agility
  const attrGroup = useAttrDiceGroup(attrKey)
  const skillRating = useActiveSkillRating(weapon.skill)
  const woundGroup = useWoundDiceGroup()

  const skillGroup = { name: weapon.skill, size: skillRating }

  return (
    <DicePool
      name="Attack"
      groups={[attrGroup, skillGroup, woundGroup]}
    />
  )
}
