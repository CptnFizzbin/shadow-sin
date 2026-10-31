import type { FC } from "react"

import { flattenDiceGroups } from "#/components/system/dicePool/diceGroup.tsx"
import { createDicePool } from "#/components/system/dicePool/dicePoolData.tsx"
import {
  useAttrDiceGroup,
  useWoundDiceGroup,
} from "#/hooks/system/dicePool/useDiceGroup.ts"
import { AttributeKey } from "#/system/model/attributes/attributeKey.ts"

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

  const pool = createDicePool({
    id: "magic.drainResistance",
    label: "Drain Resistance",
    groups: flattenDiceGroups([willpowerGroup, resolvedDrainAttrGroup, woundGroup]),
  })

  return <SpellCard.DicePool pool={pool} />
}
