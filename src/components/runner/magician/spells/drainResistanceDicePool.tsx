import type { FC } from "react"

import {
  useAttrDiceGroup,
  useWoundDiceGroup,
} from "#/lib/hooks/system/dicePool/useDiceGroup.ts"
import { AttributeKey } from "#/system/attributeKey.ts"

import { SpellCard } from "./spellCard.tsx"

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
    <SpellCard.DicePool
      name="Drain Resistance"
      groups={[willpowerGroup, resolvedDrainAttrGroup, woundGroup]}
    />
  )
}
