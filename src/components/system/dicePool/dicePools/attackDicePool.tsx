import type { FC } from "react"

import { DicePool } from "#/components/system/dicePool/dicePool.tsx"
import {
  useActiveSkillDiceGroup,
  useAttrDiceGroup,
  useEncumbranceDiceGroup,
  useWoundDiceGroup,
} from "#/components/system/dicePool/useDiceGroup.ts"
import { AttributeKey } from "#/system/attributeKey.ts"
import type { WeaponData } from "#/system/gear/weaponData.ts"

interface AttackDicePoolProps {
  weapon: WeaponData
}

export const AttackDicePool: FC<AttackDicePoolProps> = ({ weapon }) => {
  const attrKey = weapon.attribute ?? AttributeKey.agility
  const attrGroup = useAttrDiceGroup(attrKey)
  const skillGroup = useActiveSkillDiceGroup(weapon.skill)
  const woundGroup = useWoundDiceGroup()
  const encumbranceGroup = useEncumbranceDiceGroup()

  const affectedByEncumbrance = attrKey === AttributeKey.agility || attrKey === AttributeKey.reaction

  return (
    <DicePool
      name="Attack"
      groups={[attrGroup, skillGroup, woundGroup, affectedByEncumbrance ? encumbranceGroup : null]}
    />
  )
}
