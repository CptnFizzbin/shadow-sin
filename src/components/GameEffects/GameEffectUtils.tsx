import { DamageTrackKey } from "#/lib/system/DamageTrackKey.ts"
import { GameEffectType } from "#/lib/system/GameEffects/GameEffectType.ts"
import { GameEffectTypeOptions } from "#/lib/system/GameEffects/GameEffectTypeOptions.ts"

export function getTargetOptions(effectType: string): { label: string, value: string }[] | null {
  const opt = GameEffectTypeOptions.find((o) => o.value === effectType)
  if (!opt?.targets) return null
  return opt.targets
}

export function getDefaultTarget(effectType: string): string | undefined {
  if (effectType === GameEffectType.painTolerance) return DamageTrackKey.physical

  const opt = GameEffectTypeOptions.find((o) => o.value === effectType)
  return opt?.targets?.[0]?.value
}
