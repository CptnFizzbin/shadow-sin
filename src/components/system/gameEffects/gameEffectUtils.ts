import { GameEffectTypeOptions } from "#/system/gameEffects/gameEffectTypeOptions.ts"

/**
 * Retrieve the target options associated with a game effect type.
 *
 * @param effectType - The effect type key to look up (e.g., a value from `GameEffectType`)
 * @returns The `targets` array for the matching effect type, or `null` if no matching option or no targets exist
 */
export function getTargetOptions(effectType: string): { label: string, value: string }[] | null {
  const opt = GameEffectTypeOptions.find((o) => o.value === effectType)
  if (!opt?.targets) return null
  return opt.targets
}

/**
 * Determine the default target key for a given game effect type.
 *
 * @param effectType - The effect type identifier to look up
 * @returns The `value` of the first target for the matching option, or `undefined` if no target is available.
 */
export function getDefaultTarget(effectType: string): string | undefined {
  const opt = GameEffectTypeOptions.find((o) => o.value === effectType)
  return opt?.targets?.[0]?.value
}
