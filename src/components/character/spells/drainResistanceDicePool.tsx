import type { FC } from "react"

import { DicePool } from "#/components/system/dicePool/dicePool.tsx"
import {
  useAttrDiceGroup,
  useWoundDiceGroup,
} from "#/components/system/dicePool/useDiceGroup.ts"
import { AttributeKey } from "#/system/attributeKey.ts"

interface DrainResistanceDicePoolProps {
  drainAttribute: AttributeKey
  onRoll?: (count: number) => void
}

export const DrainResistanceDicePool: FC<DrainResistanceDicePoolProps> = ({ drainAttribute, onRoll }) => {
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
      onRoll={onRoll}
    />
  )
}
