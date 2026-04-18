import type { FC } from "react"

import { DicePool } from "#/components/dicePool/dicePool.tsx"
import { useActiveSkillDiceGroup, useAttrDiceGroup, useWoundDiceGroup } from "#/components/dicePool/useDiceGroup.ts"
import { AttributeKey } from "#/lib/system/attributeKey.ts"
import type { WeaponData } from "#/lib/system/gear/weaponData.ts"

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
