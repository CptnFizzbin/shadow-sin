import type { FC } from "react"

import type { AttributeKey } from "#/data/attributes/attributeKey.ts"
import { MagicPoolSelectors } from "#/state/runner/dicePool/magicPools.selector.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"

import { SpellCard } from "./spellCard.tsx"

interface DrainResistanceDicePoolProps {
  drainAttribute: AttributeKey
}

export const DrainResistanceDicePool: FC<DrainResistanceDicePoolProps> = ({ drainAttribute }) => {
  const pool = useRunnerSelector(MagicPoolSelectors.selectDrainResistanceTest, { attr: drainAttribute })
  return <SpellCard.DicePool pool={pool} />
}
