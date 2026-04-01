import { DamageTrackKey } from "#/lib/system/DamageTrackKey.ts"
import { GameEffectType } from "#/lib/system/GameEffects/GameEffectType.ts"
import { GameEffectTypeOptions } from "#/lib/system/GameEffects/GameEffectTypeOptions.ts"

export const dmgTrackOptions: { label: string, value: DamageTrackKey }[] = [
  { label: "Physical", value: DamageTrackKey.physical },
  { label: "Stun", value: DamageTrackKey.stun },
]

export function getTargetOptions(effectType: string): { label: string, value: string }[] | null {
  const opt = GameEffectTypeOptions.find((o) => o.value === effectType)
  if (!opt) return null
  if (!opt.targets) {
    // special-case: pain tolerance maps to damage tracks
    if (effectType === GameEffectType.painTolerance) return dmgTrackOptions
    return null
  }

  return opt.targets
}

export function getDefaultTarget(effectType: string): string | undefined {
  if (effectType === GameEffectType.painTolerance) return DamageTrackKey.physical

  const opt = GameEffectTypeOptions.find((o) => o.value === effectType)
  return opt?.targets?.[0]?.value
}
