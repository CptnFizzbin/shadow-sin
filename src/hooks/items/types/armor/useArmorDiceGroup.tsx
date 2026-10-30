import type { DiceGroup } from "#/components/system/dicePool/diceGroup.tsx"
import { DiceGroupSelectors } from "#/state/runner/diceGroup/diceGroup.selector.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"
import type { ArmorRatingType } from "#/system/model/items/armorData.ts"

/** @deprecated - use `useRunnerSelector(DiceGroupSelectors.selectArmor, { armorRating })` instead */
export function useArmorDiceGroup(type: ArmorRatingType): DiceGroup[] {
  return useRunnerSelector(DiceGroupSelectors.selectArmor, { armorRating: type })
}
