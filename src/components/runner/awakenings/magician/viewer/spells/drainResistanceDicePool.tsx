import type { FC } from "react"

import { flattenDiceGroups } from "#/components/system/dicePool/diceGroup.tsx"
import {
  useAttrDiceGroup,
} from "#/hooks/system/dicePool/useDiceGroup.ts"
import { useDicePool } from "#/hooks/system/dicePool/useDicePool.ts"
import { AttributeKey } from "#/system/model/attributes/attributeKey.ts"

import { SpellCard } from "./spellCard.tsx"

interface DrainResistanceDicePoolProps {
  drainAttribute: AttributeKey
}

export const DrainResistanceDicePool: FC<DrainResistanceDicePoolProps> = ({ drainAttribute }) => {
  const willpowerGroup = useAttrDiceGroup(AttributeKey.willpower)
  const drainAttrGroup = useAttrDiceGroup(drainAttribute)

  // When drainAttribute is willpower, disambiguate group names to avoid duplicate React keys
  const resolvedDrainAttrGroup =
    drainAttrGroup.name === willpowerGroup.name
      ? { ...drainAttrGroup, name: `${drainAttrGroup.name} (Drain)` }
      : drainAttrGroup

  const pool = useDicePool({
    id: "magic.drainResistance",
    label: "Drain Resistance",
    groups: flattenDiceGroups([willpowerGroup, resolvedDrainAttrGroup]),
  })

  return <SpellCard.DicePool pool={pool} />
}
