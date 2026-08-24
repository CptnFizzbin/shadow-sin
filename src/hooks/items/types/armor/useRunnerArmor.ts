import { ItemSelectors } from "#/stores/runner/gear/gearSlice.selectors.ts"
import { useRunnerSelector } from "#/stores/runner/runnerStore.selectors.ts"
import type { ArmorData, ArmorRating } from "#/system/gear/armorData.ts"

/** @deprecated Use `ItemSelectors.Armor.selectAll` via `useRunnerSelector` instead. */
export function useRunnerArmor(): ArmorData[] {
  return useRunnerSelector(ItemSelectors.Armor.selectAll)
}

/** @deprecated Use `ItemSelectors.Armor.selectEquipped` via `useRunnerSelector` instead. */
export function useEquipedArmor(): ArmorData[] {
  return useRunnerSelector(ItemSelectors.Armor.selectEquipped)
}

/** @deprecated Use `ItemSelectors.Armor.selectTotal` via `useRunnerSelector` instead. */
export function useTotalArmor(): ArmorRating {
  return useRunnerSelector(ItemSelectors.Armor.selectTotal)
}

/** @deprecated Use `ItemSelectors.Armor.selectEffective` via `useRunnerSelector` instead. */
export function useEffectiveArmor(): ArmorRating {
  return useRunnerSelector(ItemSelectors.Armor.selectEffective)
}
