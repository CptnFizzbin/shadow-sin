import type { ItemStateActionOption } from "#/hooks/items/state/useItemStateActions.ts"
import { useItemStateActions } from "#/hooks/items/state/useItemStateActions.ts"
import { ItemStateAction } from "#/system/formulas/items/itemStateRules.ts"
import type { FocusData } from "#/system/model/items/magicalData.ts"

/**
 * A Bonded Focus's primary state action: Equip while it's Available, Unequip while it's Equipped,
 * and none otherwise (Stashed, or not Bonded yet — Bond comes first).
 */
export function useFocusEquipAction(focus: FocusData): ItemStateActionOption | undefined {
  return useItemStateActions(focus).find(({ action }) =>
    action === ItemStateAction.equip || action === ItemStateAction.unequip,
  )
}
