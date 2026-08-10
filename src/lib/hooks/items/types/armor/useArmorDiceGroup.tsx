import type { DiceGroup } from "#/components/system/dicePool/diceGroup.tsx"
import type { ArmorRatingType } from "#/system/gear/armorData.ts"

import { useEffectiveArmor } from "./useRunnerArmor.ts"

export function useArmorDiceGroup(type: ArmorRatingType): DiceGroup {
  const ratings = useEffectiveArmor()
  return {
    name: `Armor (${type})`,
    size: ratings[type] ?? 0,
  }
}
