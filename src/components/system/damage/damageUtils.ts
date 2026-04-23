import type { CharacterSheet } from "#/system/characterSheet.ts"
import type { DamageTrackKey } from "#/system/damageTrackKey.ts"
import { GameEffectType } from "#/system/gameEffects/gameEffectType.ts"

/**
 * Returns a selector that computes the total pain tolerance modifier for a
 * given damage track target.
 *
 * Pain tolerance effects can come from qualities (always active) or from
 * equipped gear items. A positive value increases the wound interval (e.g.
 * High Pain Tolerance +1 → every 4 boxes), and a negative value decreases it
 * (e.g. Low Pain Tolerance -1 → every 2 boxes).
 *
 * Usage:
 *   useCharacterSheet(selectPainToleranceModifier(DamageTrackKey.physical))
 *   useStore(store, selectPainToleranceModifier("all"))
 *
 * @param track - The damage track (or "all") to compute the modifier for
 * @returns A selector `(sheet) => number`
 */
export function selectPainToleranceModifier(track: DamageTrackKey | "all") {
  return (sheet: CharacterSheet): number => {
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
}

/**
 * Returns a selector that computes the wound interval for a damage track: the
 * number of boxes per wound penalty step.
 *
 * The default interval is 3 (Shadowrun 4e core rule). Pain tolerance modifies
 * this value. The result is clamped to a minimum of 1 to avoid division by
 * zero.
 *
 * Usage:
 *   useCharacterSheet(selectWoundInterval(DamageTrackKey.physical))
 *   useStore(store, selectWoundInterval(DamageTrackKey.stun))
 *
 * @param track - The damage track to compute the interval for
 * @returns A selector `(sheet) => number` (result ≥ 1)
 */
export function selectWoundInterval(track: DamageTrackKey) {
  return (sheet: CharacterSheet): number => {
    const baseInterval = 3
    return Math.max(1, baseInterval + selectPainToleranceModifier(track)(sheet))
  }
}
