import type { FC } from "react"

import { DicePool } from "#/components/system/dicePool/dicePool.tsx"
import { useActiveSkillDiceGroup, useAttrDiceGroup, useWoundDiceGroup } from "#/components/system/dicePool/useDiceGroup.ts"
import { AttributeKey } from "#/system/attributeKey.ts"
import type { WeaponData } from "#/system/gear/weaponData.ts"

interface AttackDicePoolProps {
  weapon: WeaponData
}

export const AttackDicePool: FC<AttackDicePoolProps> = ({ weapon }) => {
  const attrKey = weapon.attribute ?? AttributeKey.agility

  return (
    <DicePool
      name="Attack"
      groups={[
        useAttrDiceGroup(attrKey),
        useActiveSkillDiceGroup(weapon.skill),
        useWoundDiceGroup(),
      ]}
    />
  )
}
