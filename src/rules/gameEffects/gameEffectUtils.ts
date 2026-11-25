import { isItemActive } from "#/system/formulas/items/itemStateRules.ts"
import { focusEffectsApply, getFocusGameEffects } from "#/system/formulas/magic/focusRules.ts"
import type { EffectByType, GameEffectData } from "#/system/model/gameEffects/gameEffectData.ts"
import type { GameEffectType } from "#/system/model/gameEffects/gameEffectType.ts"
import type { ItemData } from "#/system/model/items/itemData.ts"
import { isFocusData } from "#/system/model/items/magicalData.ts"

export function filterByEffectType<TType extends GameEffectType>(type: TType) {
  return (item: GameEffectData): item is EffectByType[TType] => item.type === type
}

/**
 * Whether an item's Game Effects apply to its owner: only while it is Equipped, Implanted, or
 * Active — and, for a Focus, only once it's Bonded too.
 */
export function itemEffectsApply(item: ItemData): boolean {
  return isFocusData(item) ? focusEffectsApply(item) : isItemActive(item)
}

/**
 * The Game Effects `item` grants while they apply. A Focus's come from its type, Force, and link
 * rather than being entered by hand.
 */
export function getItemGameEffects(item: ItemData): GameEffectData[] {
  return isFocusData(item) ? getFocusGameEffects(item) : item.effects ?? []
}
