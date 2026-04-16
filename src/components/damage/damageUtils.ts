import type { CharacterSheet } from "#/lib/system/characterSheet.ts"
import type { DamageTrackKey } from "#/lib/system/damageTrackKey.ts"
import { GameEffectType } from "#/lib/system/gameEffects/gameEffectType.ts"

/**
 * Compute the total pain tolerance modifier for a given damage track.
 *
 * Pain tolerance effects can come from qualities (always active) or from
 * equipped gear items. A positive value increases the wound interval (e.g.
 * High Pain Tolerance +1 → every 4 boxes), and a negative value decreases it
 * (e.g. Low Pain Tolerance -1 → every 2 boxes).
 *
 * @param sheet - The character sheet to inspect
 * @param track - The damage track to compute the modifier for
 * @returns The sum of all applicable pain tolerance effect values
 */
export function getPainToleranceModifier(sheet: CharacterSheet, track: DamageTrackKey): number {
  let modifier = 0

  for (const quality of sheet.qualities) {
    for (const effect of quality.effects ?? []) {
      if (
        effect.type === GameEffectType.painTolerance
        && (effect.target === track || effect.target === "all")
      ) {
        modifier += effect.value
      }
    }
  }

  for (const item of Object.values(sheet.gear)) {
    if (item.equipped === false) continue
    for (const effect of item.effects ?? []) {
      if (
        effect.type === GameEffectType.painTolerance
        && (effect.target === track || effect.target === "all")
      ) {
        modifier += effect.value
      }
    }
  }

  return modifier
}

/**
 * Compute the wound interval for a damage track: the number of boxes per
 * wound penalty step.
 *
 * The default interval is 3 (Shadowrun 4e core rule). Pain tolerance modifies
 * this value. The result is clamped to a minimum of 1 to avoid division by
 * zero.
 *
 * @param sheet - The character sheet to inspect
 * @param track - The damage track to compute the interval for
 * @returns The wound interval (≥ 1)
 */
export function getWoundInterval(sheet: CharacterSheet, track: DamageTrackKey): number {
  const baseInterval = 3
  return Math.max(1, baseInterval + getPainToleranceModifier(sheet, track))
}
