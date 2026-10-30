import type { FC } from "react"

import { useAttrDiceGroup } from "#/hooks/system/dicePool/useDiceGroup.ts"
import { AttributeKey } from "#/system/model/attributes/attributeKey.ts"

import { SpellCard } from "./spellCard.tsx"

interface DrainResistanceDicePoolProps {
  drainAttribute: AttributeKey
}

/** Drain Resistance is a Resistance Test, so the pool never takes the Wound Modifier. */
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
