import { isItemActive } from "#/system/formulas/items/itemStateRules.ts"
import type { EffectByType, GameEffectData } from "#/system/model/gameEffects/gameEffectData.ts"
import type { GameEffectType } from "#/system/model/gameEffects/gameEffectType.ts"
import type { ItemData } from "#/system/model/items/itemData.ts"

export function filterByEffectType<TType extends GameEffectType>(type: TType) {
  return (item: GameEffectData): item is EffectByType[TType] => item.type === type
}

/** Whether an item's Game Effects apply to its owner: only while it is Equipped or Implanted. */
export function itemEffectsApply(item: Pick<ItemData, "state">): boolean {
  return isItemActive(item)
}
