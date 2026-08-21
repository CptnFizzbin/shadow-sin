import { createSelector } from "reselect"

import { selectWoundInterval } from "#/components/system/damage/damageUtils.ts"
import type { Selector } from "#/integrations/reselect/selectorUtils.ts"
import { selectAttrBase } from "#/lib/stores/runner/attributes/attributesSlice.selectors.ts"
import { AttributeKey } from "#/system/attributeKey.ts"
import { DamageTrackKey } from "#/system/damageTrackKey.ts"
import type { RunnerData } from "#/system/runnerData.ts"

export interface DamageTrackInfo {
  max: number
  current: number
  woundInterval: number
}

export function selectPhysicalTrack(state: RunnerData): DamageTrackInfo {
  return {
    max: 8 + Math.ceil(selectAttrBase(AttributeKey.body)(state) / 2),
    current: state.damage.physical,
    woundInterval: selectWoundInterval(DamageTrackKey.physical)(state),
  }
}

export function selectStunTrack(state: RunnerData): DamageTrackInfo {
  return {
    max: 8 + Math.ceil(selectAttrBase(AttributeKey.willpower)(state) / 2),
    current: state.damage.stun,
    woundInterval: selectWoundInterval(DamageTrackKey.stun)(state),
  }
}

export function selectMatrixTrack(state: RunnerData, system: number = 0): DamageTrackInfo {
  return {
    max: 8 + Math.ceil(system / 2),
    current: state.damage.matrix,
    woundInterval: 3,
  }
}

const legacy = { selectPhysicalTrack, selectStunTrack, selectMatrixTrack }

/** Standardized, namespaced selectors for the Damage domain — see
 *  docs/adr/0014-selector-input-decomposition.md. Wraps the legacy exports above; existing call
 *  sites are unaffected. */
export namespace DamageSelectors {
  export const selectPhysical: Selector<RunnerData, DamageTrackInfo> = (state) =>
    legacy.selectPhysicalTrack(state)
  export const selectStun: Selector<RunnerData, DamageTrackInfo> = (state) =>
    legacy.selectStunTrack(state)

  export const selectMatrix: Selector<RunnerData, DamageTrackInfo, { system?: number }> = createSelector(
    [
      (state: RunnerData) => state,
      (_state: RunnerData, options: { system?: number }) => options.system ?? 0,
    ],
    (runner, system) => legacy.selectMatrixTrack(runner, system),
  )
}
