import type { DiceGroup } from "#/components/system/dicePool/diceGroup.tsx"
import { ItemSelectors } from "#/stores/runner/gear/gearSlice.selectors.ts"
import { useRunnerSelector } from "#/stores/runner/runnerStore.selectors.ts"
import type { ArmorRatingType } from "#/system/gear/armorData.ts"

export function useArmorDiceGroup(type: ArmorRatingType): DiceGroup {
  const ratings = useRunnerSelector(ItemSelectors.Armor.selectEffective)
  return {
    name: `Armor (${type})`,
    size: ratings[type] ?? 0,
  }
}
