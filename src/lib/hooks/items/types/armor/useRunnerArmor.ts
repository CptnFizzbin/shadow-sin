import { Selectors, useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import type { ArmorData, ArmorRating } from "#/system/gear/armorData.ts"
import { ItemType } from "#/system/itemType.ts"

/**
 * @deprecated Use `useRunnerSelector(({ item }) => item.byType(ItemType.armor))` instead — see
 * `docs/adr/0013-unify-runner-state-access.md`.
 */
export function useRunnerArmor(): ArmorData[] {
  const armor = useRunnerStoreSelector(Selectors.gear.selectGearOfType(ItemType.armor))
  return Object.values(armor)
}

/**
 * @deprecated Use `useRunnerSelector(({ item }) => item.byType(ItemType.armor).filter((a) =>
 * a.equipped))` instead — see `docs/adr/0013-unify-runner-state-access.md`.
 */
export function useEquipedArmor(): ArmorData[] {
  const armor = useRunnerArmor()
  return armor.filter((item) => item.equipped)
}

/**
 * @deprecated Use `useRunnerSelector(({ item }) => item.armor.total)` instead — see
 * `docs/adr/0013-unify-runner-state-access.md`.
 */
export function useTotalArmor(): ArmorRating {
  const equipped = useEquipedArmor()

  return {
    ballistic: equipped.reduce((sum, armor) => sum + armor.ballistic, 0),
    impact: equipped.reduce((sum, armor) => sum + armor.impact, 0),
  }
}

/**
 * @deprecated Use `useRunnerSelector(({ item }) => item.armor.effective)` instead — see
 * `docs/adr/0013-unify-runner-state-access.md`.
 */
export function useEffectiveArmor(): ArmorRating {
  const equipped = useEquipedArmor()

  return {
    ballistic: Math.max(0, ...equipped.map((armor) => armor.ballistic)),
    impact: Math.max(0, ...equipped.map((armor) => armor.impact)),
  }
}
