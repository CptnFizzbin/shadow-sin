import type { FC } from "react"

import { MagicPoolSelectors } from "#/state/runner/dicePool/magicPools.selector.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"
import type { SpellCategory } from "#/system/model/magic/spellData.ts"

import { SpellCard } from "./spellCard.tsx"

interface SpellcastingDicePoolProps {
  spellCategory: SpellCategory
}

export const SpellcastingDicePool: FC<SpellcastingDicePoolProps> = ({ spellCategory }) => {
  const pool = useRunnerSelector(MagicPoolSelectors.selectSpellcastingTest, { spellCategory })
  return <SpellCard.DicePool pool={pool} />
}
