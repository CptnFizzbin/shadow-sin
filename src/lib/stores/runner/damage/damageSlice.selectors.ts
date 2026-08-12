import { selectWoundInterval } from "#/components/system/damage/damageUtils.ts"
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
