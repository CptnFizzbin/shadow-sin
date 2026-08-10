import type { DamageTrackKey } from "#/system/damageTrackKey.ts"
import type { RunnerData } from "#/system/runnerData.ts"

import type { DamageTrackFacets } from "./damage.selectors.ts"
import { selectDamageTrackFacets, selectWoundMod } from "./damage.selectors.ts"

export interface RunnerDamageCatalog {
  (track: DamageTrackKey): DamageTrackFacets
  woundMod: number
}

export function buildDamageCatalog(state: RunnerData): RunnerDamageCatalog {
  const catalog = (track: DamageTrackKey): DamageTrackFacets => selectDamageTrackFacets(state, track)
  return Object.assign(catalog, { woundMod: selectWoundMod(state) })
}
