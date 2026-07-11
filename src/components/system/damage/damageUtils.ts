import type { DamageTrackKey } from "#/system/damageTrackKey.ts"
import { GameEffectType } from "#/system/gameEffects/gameEffectType.ts"
import type { RunnerData } from "#/system/runnerData.ts"

/**
 * Returns a selector that sums High Pain Tolerance ratings for a given damage
 * track. HPT effects can come from qualities (always active) or from equipped
 * gear. The offset is subtracted from raw damage before dividing by the wound
 * interval, clamped to a minimum of 0.
 *
 * @param track - The damage track to compute the offset for
 * @returns A selector `(sheet) => number`
 */
function selectHighPainToleranceOffset(track: DamageTrackKey) {
  return (sheet: RunnerData): number => {
    let offset = 0

    for (const quality of sheet.qualities) {
      for (const effect of quality.effects ?? []) {
        if (
          effect.type === GameEffectType.highPainTolerance
          && (effect.target === track || effect.target === "all")
        ) {
          offset += effect.value
        }
      }
    }

    for (const item of Object.values(sheet.gear)) {
      if (item.equipped !== true) continue
      for (const effect of item.effects ?? []) {
        if (
          effect.type === GameEffectType.highPainTolerance
          && (effect.target === track || effect.target === "all")
        ) {
          offset += effect.value
        }
      }
    }

    return offset
  }
}

/**
 * Returns a selector that sums Low Pain Tolerance interval modifiers for a
 * given damage track. LPT shrinks the wound interval (value is negative).
 * Effects can come from qualities (always active) or from equipped gear.
 *
 * @param track - The damage track to compute the modifier for
 * @returns A selector `(sheet) => number`
 */
function selectLowPainToleranceModifier(track: DamageTrackKey) {
  return (sheet: RunnerData): number => {
    let modifier = 0

    for (const quality of sheet.qualities) {
      for (const effect of quality.effects ?? []) {
        if (
          effect.type === GameEffectType.lowPainTolerance
          && (effect.target === track || effect.target === "all")
        ) {
          modifier += effect.value
        }
      }
    }

    for (const item of Object.values(sheet.gear)) {
      if (item.equipped !== true) continue
      for (const effect of item.effects ?? []) {
        if (
          effect.type === GameEffectType.lowPainTolerance
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
 * The default interval is 3 (Shadowrun 4e core rule). Only Low Pain Tolerance
 * modifies this value. High Pain Tolerance does NOT change the interval — it
 * instead offsets raw damage before the division. The result is clamped to a
 * minimum of 1 to avoid division by zero.
 *
 * Usage:
 *   useRunnerData(selectWoundInterval(DamageTrackKey.physical))
 *   useSelector(store, selectWoundInterval(DamageTrackKey.stun))
 *
 * @param track - The damage track to compute the interval for
 * @returns A selector `(sheet) => number` (result ≥ 1)
 */
export function selectWoundInterval(track: DamageTrackKey) {
  return (sheet: RunnerData): number => {
    const baseInterval = 3
    return Math.max(1, baseInterval + selectLowPainToleranceModifier(track)(sheet))
  }
}

/**
 * Returns a selector that computes the full wound modifier for a single damage
 * track. High Pain Tolerance is applied as a damage offset first; then the
 * adjusted damage is divided by the (LPT-adjusted) interval.
 *
 * Formula: `floor(max(0, damage - hptOffset) / interval)`
 *
 * Usage:
 *   useRunnerData(selectTrackWoundModifier(DamageTrackKey.physical))
 *
 * @param track - The damage track to compute the wound modifier for
 * @returns A selector `(sheet) => number`
 */
export function selectTrackWoundModifier(track: DamageTrackKey) {
  return (sheet: RunnerData): number => {
    const damage = sheet.damage[track]
    const hptOffset = selectHighPainToleranceOffset(track)(sheet)
    const interval = selectWoundInterval(track)(sheet)
    return Math.floor(Math.max(0, damage - hptOffset) / interval)
  }
}
