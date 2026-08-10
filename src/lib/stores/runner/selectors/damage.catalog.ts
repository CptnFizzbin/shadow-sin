import type { DamageTrackKey } from "#/system/damageTrackKey.ts"
import type { RunnerData } from "#/system/runnerData.ts"

import type { DamageTrackFacets } from "./damage.selectors.ts"
import { selectDamageTrackFacets, selectWoundMod } from "./damage.selectors.ts"

export function buildDamageCatalog(state: RunnerData) {
  const catalog = (track: DamageTrackKey): DamageTrackFacets => selectDamageTrackFacets(state, track)
  return Object.assign(catalog, { woundMod: selectWoundMod(state) })
}
