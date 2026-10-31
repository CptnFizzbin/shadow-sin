import type { EffectByType, GameEffectData } from "#/system/model/gameEffects/gameEffectData.ts"
import type { GameEffectType } from "#/system/model/gameEffects/gameEffectType.ts"
import type { ItemData } from "#/system/model/items/itemData.ts"

export function filterByEffectType<TType extends GameEffectType>(type: TType) {
  return (item: GameEffectData): item is EffectByType[TType] => item.type === type
}

/**
 * Whether an item's Game Effects apply to its owner. Items without an `equipped` field have no equipped
 * state to toggle, so their effects always apply; items with one apply only while equipped.
 */
export function itemEffectsApply(item: Pick<ItemData, "equipped">): boolean {
  return item.equipped ?? true
}
