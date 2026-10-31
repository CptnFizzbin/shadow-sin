import type { FC } from "react"

import { MagicPoolSelectors } from "#/state/runner/dicePool/magicPools.selector.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"

import { SpellCard } from "./spellCard.tsx"

export const SpellcastingDicePool: FC = () => {
  const pool = useRunnerSelector(MagicPoolSelectors.selectSpellcastingTest)
  return <SpellCard.DicePool pool={pool} />
}
