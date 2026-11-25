import type { FC } from "react"

import type { SpellCategory } from "#data/magic/spellData.ts"
import { MagicPoolSelectors } from "#state/runner/dicePool/magicPools.selector.ts"
import { useRunnerSelector } from "#state/runner/runnerStore.selectors.ts"

import { SpellCard } from "./spellCard.tsx"

interface SpellcastingDicePoolProps {
  spellCategory: SpellCategory
}

export const SpellcastingDicePool: FC<SpellcastingDicePoolProps> = ({ spellCategory }) => {
  const pool = useRunnerSelector(MagicPoolSelectors.selectSpellcastingTest, { spellCategory })
  return <SpellCard.DicePool pool={pool} />
}
