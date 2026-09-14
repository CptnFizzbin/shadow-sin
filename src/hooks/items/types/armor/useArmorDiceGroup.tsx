import type { DiceGroup } from "#/components/system/dicePool/diceGroup.tsx"
import { ItemSelectors } from "#/state/runner/items/items.selector.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"
import type { ArmorRatingType } from "#/system/model/items/armorData.ts"

export function useArmorDiceGroup(type: ArmorRatingType): DiceGroup {
  const ratings = useRunnerSelector(ItemSelectors.Armor.selectEffective)
  return {
    name: `Armor (${type})`,
    size: ratings[type] ?? 0,
  }
}
