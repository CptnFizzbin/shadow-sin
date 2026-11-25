import type { ItemStateActionOption } from "#/hooks/items/state/useItemStateActions.ts"
import { useItemStateActions } from "#/hooks/items/state/useItemStateActions.ts"
import { ItemStateAction } from "#/system/formulas/items/itemStateRules.ts"
import type { ConsumableData } from "#/system/model/items/consumableData.ts"

/**
 * A Consumable's primary action: Consume while it's Available with a unit left, End Effect while
 * it's Active, and none otherwise (Stashed, or out of units).
 */
export function useConsumeAction(consumable: ConsumableData): ItemStateActionOption | undefined {
  return useItemStateActions(consumable).find(({ action }) =>
    action === ItemStateAction.consume || action === ItemStateAction.endEffect)
}
