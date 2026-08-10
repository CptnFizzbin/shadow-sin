import { selectTrackWoundModifier } from "#/components/system/damage/damageUtils.ts"
import { selectMatrixTrack, selectPhysicalTrack, selectStunTrack } from "#/lib/stores/runner/damage/damageSlice.selectors.ts"
import { DamageTrackKey } from "#/system/damageTrackKey.ts"
import type { RunnerData } from "#/system/runnerData.ts"

export interface DamageTrackFacets {
  current: number
  max: number
}

export interface RunnerDamageCatalog {
  (track: DamageTrackKey): DamageTrackFacets
  woundMod: number
}

const damageTrackSelectors = {
  [DamageTrackKey.physical]: selectPhysicalTrack,
  [DamageTrackKey.stun]: selectStunTrack,
  [DamageTrackKey.matrix]: selectMatrixTrack,
}

/** Also reachable as `modifiers(Modifier.woundMod).value` — same Selector, see `modifiers.catalog.ts`. */
export function selectWoundMod(state: RunnerData): number {
  return selectTrackWoundModifier(DamageTrackKey.physical)(state)
    + selectTrackWoundModifier(DamageTrackKey.stun)(state)
}

export function buildDamageCatalog(state: RunnerData): RunnerDamageCatalog {
  const catalog = (track: DamageTrackKey): DamageTrackFacets => {
    const { current, max } = damageTrackSelectors[track](state)
    return { current, max }
  }

  return Object.assign(catalog, { woundMod: selectWoundMod(state) })
}
