import { DamageTrackKey } from "#/lib/system/DamageTrackKey.ts"
import { GameEffectType } from "#/lib/system/GameEffects/GameEffectType.ts"
import { GameEffectTypeOptions } from "#/lib/system/GameEffects/GameEffectTypeOptions.ts"

export function getTargetOptions(
  type: string,
): Array<{ label: string; value: string }> | null {
  const option = GameEffectTypeOptions.find((o) => o.value === type)
  if (!option || !option.targets) {
    return null
  }
  return option.targets
}

export function getDefaultTarget(type: string): string | undefined {
  const targets = getTargetOptions(type)
  if (!targets || targets.length === 0) {
    return undefined
  }

  if (type === GameEffectType.painTolerance) {
    return DamageTrackKey.physical
  }

  return targets[0]!.value
}