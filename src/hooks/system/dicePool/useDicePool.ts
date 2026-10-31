import type { DicePoolConfig, DicePoolData } from "#/components/system/dicePool/dicePoolData.tsx"
import { createDicePool } from "#/components/system/dicePool/dicePoolData.tsx"
import { DamageSelectors } from "#/state/runner/damage/damage.selector.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"

/** Builds a dice pool from `config`, applying the Runner's current wound modifier (see `createDicePool`). */
export function useDicePool(config: DicePoolConfig): DicePoolData {
  const woundMod = useRunnerSelector(DamageSelectors.selectWoundMod)
  return createDicePool(config, woundMod)
}
