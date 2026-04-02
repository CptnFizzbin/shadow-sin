import { DamageTrackKey } from "#/lib/system/DamageTrackKey.ts"
import { GameEffectType } from "#/lib/system/GameEffects/GameEffectType.ts"
import { GameEffectTypeOptions } from "#/lib/system/GameEffects/GameEffectTypeOptions.ts"

/**
 * Retrieves the target options for a given game effect type.
 *
 * @param effectType - The effect type identifier to look up.
 * @returns The array of target option objects `{ label, value }` for the effect type, or `null` if no matching options or targets are found.
 */
export function getTargetOptions(effectType: string): { label: string, value: string }[] | null {
  const opt = GameEffectTypeOptions.find((o) => o.value === effectType)
  if (!opt?.targets) return null
  return opt.targets
}

/**
 * Determine the default target key for a given game effect type.
 *
 * @param effectType - The game effect type identifier to look up.
 * @returns The default target's `value` for the effect type, `DamageTrackKey.physical` when `effectType` is `GameEffectType.painTolerance`, or `undefined` if no default target exists.
 */
export function getDefaultTarget(effectType: string): string | undefined {
  if (effectType === GameEffectType.painTolerance) return DamageTrackKey.physical

  const opt = GameEffectTypeOptions.find((o) => o.value === effectType)
  return opt?.targets?.[0]?.value
}
