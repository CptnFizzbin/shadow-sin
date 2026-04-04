import type { FC } from "react"

import { DicePool } from "#/components/DicePool/dice-pool.tsx"
import {
  useAttrDiceGroup,
  useWoundDiceGroup,
} from "#/components/DicePool/use-dice-group.ts"
import { AttributeKey } from "#/lib/system/attribute-key.ts"

interface DrainResistanceDicePoolProps {
  drainAttribute: AttributeKey
}

export const DrainResistanceDicePool: FC<DrainResistanceDicePoolProps> = ({ drainAttribute }) => {
  const willpowerGroup = useAttrDiceGroup(AttributeKey.willpower)
  const drainAttrGroup = useAttrDiceGroup(drainAttribute)
  const woundGroup = useWoundDiceGroup()

  // When drainAttribute is willpower, disambiguate group names to avoid duplicate React keys
  const resolvedDrainAttrGroup =
    drainAttrGroup.name === willpowerGroup.name
      ? { ...drainAttrGroup, name: `${drainAttrGroup.name} (Drain)` }
      : drainAttrGroup

  return (
    <DicePool
      name="Drain Resistance"
      groups={[willpowerGroup, resolvedDrainAttrGroup, woundGroup]}
    />
  )
}
