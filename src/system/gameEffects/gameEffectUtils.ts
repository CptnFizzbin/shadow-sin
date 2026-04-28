import type { EffectByType, GameEffectData } from "./gameEffectData.ts"
import type { GameEffectType } from "./gameEffectType.ts"

export function filterByEffectType<TType extends GameEffectType>(type: TType) {
  return (item: GameEffectData): item is EffectByType[TType] => item.type === type
}
