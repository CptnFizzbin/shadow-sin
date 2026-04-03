import type { FC } from "react"

import { DicePool } from "#/components/DicePool/dice-pool.tsx"
import {
  useDiceAttributeGroup,
  useWoundDiceGroup,
} from "#/components/DicePool/use-dice-group.ts"
import { AttributeKey } from "#/lib/system/attribute-key.ts"

interface DrainResistanceDicePoolProps {
  drainAttribute: AttributeKey
}

export const DrainResistanceDicePool: FC<DrainResistanceDicePoolProps> = ({ drainAttribute }) => {
  const willpowerGroup = useDiceAttributeGroup(AttributeKey.willpower)
  const drainAttrGroup = useDiceAttributeGroup(drainAttribute)
  const woundGroup = useWoundDiceGroup()

  return (
    <DicePool
      name="Drain Resistance"
      groups={[willpowerGroup, drainAttrGroup, woundGroup]}
    />
  )
}
