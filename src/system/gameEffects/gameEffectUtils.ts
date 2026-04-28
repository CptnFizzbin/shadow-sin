import type { EffectByType, GameEffectData } from "#/system/gameEffects/gameEffectData.ts"
import type { GameEffectType } from "#/system/gameEffects/gameEffectType.ts"

export function filterByEffectType<TType extends GameEffectType>(type: TType) {
  return (item: GameEffectData): item is EffectByType[TType] => item.type === type
}
