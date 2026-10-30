import type { FC } from "react"

import { useAttrDiceGroup } from "#/hooks/system/dicePool/useDiceGroup.ts"
import { AttributeKey } from "#/system/model/attributes/attributeKey.ts"

import { SpellCard } from "./spellCard.tsx"

interface DrainResistanceDicePoolProps {
  drainAttribute: AttributeKey
}

export const DrainResistanceDicePool: FC<DrainResistanceDicePoolProps> = ({ drainAttribute }) => {
  const willpowerGroups = useAttrDiceGroup(AttributeKey.willpower)
  const drainAttrGroups = useAttrDiceGroup(drainAttribute)

  return (
    <SpellCard.DicePool
      name="Drain Resistance"
      groups={[willpowerGroups, drainAttrGroups]}
    />
  )
}
