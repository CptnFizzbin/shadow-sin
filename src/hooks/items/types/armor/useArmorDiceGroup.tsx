import type { DiceGroup } from "#/components/system/dicePool/diceGroup.tsx"
import { DicePoolSelectors } from "#/state/runner/dicePool/dicePool.selector.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"
import type { ArmorRatingType } from "#/system/model/items/armorData.ts"

/** @deprecated - use `useRunnerSelector(DicePoolSelectors.selectArmorGroup, { armorRating })` instead */
export function useArmorDiceGroup(type: ArmorRatingType): DiceGroup {
  return useRunnerSelector(DicePoolSelectors.selectArmorGroup, { armorRating: type })
}
