import type { GameEffectData } from "./gameEffectData.ts"
import { GameEffectTypeOptions } from "./gameEffectTypeOptions.ts"

/**
 * Returns a short human-readable label for a game effect, e.g. "Attr Mod → Body +2".
 */
export function getEffectLabel(effect: GameEffectData): string {
  const typeOption = GameEffectTypeOptions.find((option) => option.value === effect.type)
  const typeLabel = typeOption?.label ?? effect.type

  const targetLabel = effect.target
    ? typeOption?.targets?.find((target) => target.value === effect.target)?.label ?? effect.target
    : undefined

  const sign = effect.value >= 0 ? "+" : ""

  const parts = [typeLabel, targetLabel, effect.subTarget].filter(Boolean)
  return `${parts.join(" → ")} ${sign}${effect.value}`
}
