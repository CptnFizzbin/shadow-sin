import { Selectors, useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import type { ArmorData, ArmorRating } from "#/system/gear/armorData.ts"
import { ItemType } from "#/system/itemType.ts"

export function useRunnerArmor(): ArmorData[] {
  const armor = useRunnerStoreSelector(Selectors.gear.selectGearOfType(ItemType.armor))
  return Object.values(armor)
}

export function useEquipedArmor(): ArmorData[] {
  const armor = useRunnerArmor()
  return armor.filter((item) => item.equipped)
}

export function useTotalArmor(): ArmorRating {
  const equipped = useEquipedArmor()

  return {
    ballistic: equipped.reduce((sum, armor) => sum + armor.ballistic, 0),
    impact: equipped.reduce((sum, armor) => sum + armor.impact, 0),
  }
}

export function useEffectiveArmor(): ArmorRating {
  const equipped = useEquipedArmor()

  return {
    ballistic: Math.max(0, ...equipped.map((armor) => armor.ballistic)),
    impact: Math.max(0, ...equipped.map((armor) => armor.impact)),
  }
}
