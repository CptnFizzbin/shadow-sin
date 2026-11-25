import type { ItemStateActionOption } from "#/app/hooks/items/state/useItemStateActions.ts"
import { useItemStateActions } from "#/app/hooks/items/state/useItemStateActions.ts"
import type { ConsumableData } from "#/data/items/consumableData.ts"
import { ItemStateAction } from "#/rules/items/itemStateRules.ts"

/**
 * A Consumable's primary action: Consume while it's Available with a unit left, End Effect while
 * it's Active, and none otherwise (Stashed, or out of units).
 */
export function useConsumeAction(consumable: ConsumableData): ItemStateActionOption | undefined {
  return useItemStateActions(consumable).find(({ action }) =>
    action === ItemStateAction.consume || action === ItemStateAction.endEffect)
}
